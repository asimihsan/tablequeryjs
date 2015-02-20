/*!
 * tablequeryjs
 * https://github.com/asimihsan/tablequeryjs
 *
 * Copyright 2013 Asim Ihsan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*

References:
-   http://stackoverflow.com/a/5947280/223301

*/

/*
Examples:

'first name' ilike Mark
'first name' like r
'first name' like Mark or number = 3
number = 3
number == 3
not number == 3
not 'first name' ilike mark
not ('first name' ilike mark or number = 2)

*/

var tablequery = tablequery || {};
tablequery._.extend(tablequery, (function() {

    var table; // = $("table");
    var table_parent;
    var table_tbody_rows;
    var table_search_text; // = $("#table_search_text");

    var parser_exception_message;
    var table_headings = {};
    var table_column_types = {};
    var table_search_text_keyup_timer;

    tablequery._get_rows_to_display = function(trees) {
        //console.log("get_rows_to_display.");
        //console.log(trees);
        var return_value;
        var node_type = trees[0];
        var left = trees[1];
        if (trees.length == 3) {
            var right = trees[2];
        }
        if (!($.isArray(left))) {
            //console.log("Child nodes.");
            switch(node_type) {
                case "EQ":
                case "NEQ":
                    var expr = new RegExp("^" + right + "$");
                    break;
                case "ILIKE":
                case "NILIKE":
                    var expr = new RegExp(right, "i");
                    break;
                case "LIKE":
                case "NLIKE":
                    var expr = new RegExp(right);
                    break;
                case "ILIKE_ANY":
                    var expr = new RegExp(left, "i");
                    break;
            } // switch(node_type)
            if (left in table_headings) {
                var column_indices = [table_headings[left]];
            } else if (node_type === "ILIKE_ANY") {
                var column_indices = tablequery._.values(table_headings);
            } else {
                var column_indices = [];
            }
            var test_for_true = node_type.substring(0,1) != "N";
            if (!(tablequery._.isUndefined(right))) {
                var date_range = tablequery.get_date_range(node_type, right);
                var time_range = tablequery.get_time_range(node_type, right);
            }
            return_value = table_tbody_rows.filter(function(index, row) {
                return tablequery._.any(
                    tablequery._.map($(row).children(), function(column, index) {
                        if (!(tablequery._.contains(column_indices, index))) {
                            return;
                        }
                        var text = $.trim(column.textContent);
                        switch(table_column_types[index]) {
                            case "date":
                                return {"type": "date",
                                        "value": tablequery._get_datetime(text)};
                            case "time":
                                return {"type": "time",
                                        "value": tablequery._get_time(text)};
                            case "number":
                                if (_isNumber(text)) {
                                    return {"type": "number",
                                            "value": parseInt(text, 10)};                                
                                }
                            case "text":
                                return {"type": "text",
                                        "value": text};
                        }
                    }),
                    function(data) {
                        if (tablequery._.isUndefined(data)) {
                            return false;
                        }
                        switch(data.type) {
                            case "time":
                                if (tablequery._.isUndefined(time_range))
                                    return false;
                                result = time_range.contains(data.value);
                                break;
                            case "date":
                                if (tablequery._.isUndefined(date_range))
                                    return false;
                                result = date_range.contains(data.value);
                                break;
                            case "number":
                            case "text":
                                result = expr.test(data.value);
                                break;
                        }
                        if (test_for_true) {
                            return result;
                        } else {
                            return !result;
                        }
                    }
                );
            });
        } else {
            //console.log("Interior nodes.");
            var left_trees = tablequery._get_rows_to_display(left);
            if (trees.length == 3) {
                var right_trees = tablequery._get_rows_to_display(right);
            }
            switch(node_type) {
                case "AND":
                    //console.log("AND");
                    return_value = tablequery._.intersection(left_trees, right_trees);
                    break;
                case "OR":
                    return_value = left_trees.add(right_trees);
                    break;
                case "NOT":
                    //console.log("NOT");
                    var left_tree_indices = {}
                    tablequery._.each(left_trees, function(obj) { left_tree_indices[$(obj).index()] = true; });
                    return_value = tablequery._.filter(table_tbody_rows, function(row) {
                        return !($(row).index() in left_tree_indices);
                    });
            } // switch(node_type)
        } // if (!($.isArray(left)))
        if (!return_value) {
            //console.log("no return value, return all rows.");
            return_value = table_tbody_rows;
        }
        //console.log("returning")
        //console.log(return_value);
        return return_value;
    }
    tablequery._get_rows_to_display = tablequery._.memoize(tablequery._get_rows_to_display);

    tablequery._parse_search_text = function(search_text) {
        var is_parse_successful = true;
        var parsed_query;
        try {
            parsed_query = parser.parse(search_text);
        } catch(e) {
            parser_exception_message = e.message;
            is_parse_successful = false;
        }
        return {"rc": is_parse_successful, "parsed_query": parsed_query};
    }

    tablequery._update_table_search_text_warning = function(is_parse_successful, clear) {
        if ((table_search_text.val().length == 0) || clear) {
            table_search_text.css("border", "");
        } else if (is_parse_successful) {
            table_search_text.css("border", "2px solid green");
        } else {
            table_search_text.css("border", "2px solid red");
        }
    }

    tablequery._update_table_lookups = function() {
        table_headings = {};
        table.find("th").each(function(i, el) {
            table_headings[$.trim(el.textContent.toLowerCase())] = i;
        });
        table_column_types = {};
        table.find("tr").eq(1).children().each(function(i, el) {
            var text = $.trim(el.textContent);
            if (_isNumber(text)) {
                table_column_types[i] = "number";
            } else if (tablequery._get_datetime(text).isValid()) {
                table_column_types[i] = "date";
            } else if (tablequery._get_time(text).isValid()) {
                table_column_types[i] = "time";
            } else {
                table_column_types[i] = "text";
            }
        });
    }

    tablequery.set_table = function(selector) {
        table = $(selector);
        table_parent = table.parent();
        table_tbody_rows = table.find("tbody tr");
        tablequery._update_table_lookups();
    }

    tablequery.hide_selector = function(selector) {
        selector.css("display", "none");
    }

    tablequery.show_selector = function(selector) {
        selector.css("display", "");
    }

    var previous_query_failed;
    tablequery.set_table_search_text = function(selector) {
        table_search_text = $(selector);

        tablequery._table_search_text_on_keyup = function(e, text_value) {
            var rv = tablequery._parse_search_text(text_value);
            tablequery._update_table_search_text_warning(rv.rc, false);
            if (rv.rc) {
                tablequery._update_table_lookups();
                previous_query_failed = false;
                var rows_to_display = tablequery._get_rows_to_display(rv.parsed_query);
                table.detach();
                tablequery.hide_selector(table_tbody_rows);
                tablequery._.each(rows_to_display, function(row) { tablequery.show_selector($(row)); });
                table_parent.append(table);
            } else {
                if (!previous_query_failed) {
                    tablequery.show_selector(table_tbody_rows);
                }
                previous_query_failed = true;
            }
            tablequery.trigger('search');
        }
        tablequery._table_search_text_on_keyup_debounced = tablequery._.debounce(tablequery._table_search_text_on_keyup, 500);
        table_search_text.keyup(function(e) {
            if ((e.keyCode || e.which || e.charCode || 0) === 13) {
                tablequery._table_search_text_on_keyup(e, table_search_text.val());
            } else {
                tablequery._table_search_text_on_keyup_debounced(e, table_search_text.val());
            }
        });

        // Suppress form submit.
        table_search_text.keypress(function(e) {
            return (e.keyCode || e.which || e.charCode || 0) !== 13;
        });

        table_search_text.click(function() {
            tablequery._table_search_text_on_keyup_debounced(undefined,
                                                             table_search_text.val());
        });
        table_search_text.blur(function() {
            tablequery._table_search_text_on_keyup_debounced(undefined,
                                                             table_search_text.val());
        });
        // --------------------------------------------------------------------
    }

    tablequery._now = function() {
        return moment();
    }

    tablequery._get_time = function(string) {
        if (!(/^(\d{1,2}|\d{1,2}:\d{2}|\d{1,2}:\d{2}:\d{2})$/.test(string))) {
            return moment("-");
        }        
        return_value = moment(string, [
            'ss',
            'mm:ss',
            'HH:mm:ss'
        ]);
        if (!(tablequery._.contains(tablequery._.functions(return_value), 'isValid'))) {
            return moment("-");
        }
        return return_value;
    }
    tablequery._get_time = tablequery._.memoize(tablequery._get_time);

    tablequery._get_datetime = function(string) {
        return_value = moment(string, [
            "YYYY-MM-DD",
            "YYYY-MM-DD HH",
            "YYYY-MM-DD HH:mm",
            "YYYY-MM-DD HH:mm:ss",
            "YYYY-MM-DD HH:mm:ssZ",
            "YYYY-MM-DDTHH:mm:ss",
            "YYYY-MM-DDTHH:mm:ssZ"
        ]);
        if (!(tablequery._.contains(tablequery._.functions(return_value), 'isValid'))) {
            return moment("-");
        }
        return return_value;
    }
    tablequery._get_datetime = tablequery._.memoize(tablequery._get_datetime);

    tablequery.get_time_range = function(node_type, query) {
        var time = tablequery._get_time(query);
        if (!(time.isValid()))
            return;
        switch(time._f) {
            case "ss":
                var precision = "second";
                break;
            case "mm:ss":
                var precision = "minute";
                break;
            case "HH:mm:ss":
                var precision = "hour";
                break;
        }
        switch(node_type) {
            case "EQ":
            case "NEQ":
                var time_range = moment().range(moment(time).startOf(precision),
                                                moment(time).endOf(precision));
                break;
            case "LTE":
            case "LT":
                var time_range = moment().range(moment(0),
                                                moment(time));
                break;
            case "GTE":
            case "GT":
                var time_range = moment().range(moment(time),
                                                moment("9999"));
                break;
        }
        return time_range;
    }

    tablequery.get_date_range = function(node_type, query) {
        var now = tablequery._now();
        var duration, datetime, datetimeStart, datetimeEnd;
        if (query === "today") {
            duration = moment.duration(0, 'days');
        } else if (query === "yesterday") {
            duration = moment.duration(1, 'days');
        } else {
            datetime = tablequery._get_datetime(query);
            if (!(datetime.isValid()))
                return;
        }
        switch(node_type) {
            case "EQ":
            case "NEQ":
                if (!(tablequery._.isUndefined(duration))) {
                    var date_range = moment().range(moment(now - duration).startOf('day'),
                                                    moment(now - duration).endOf('day'));
                } else {
                    var date_range = moment().range(moment(datetime).startOf('day'),
                                                    moment(datetime).endOf('day'));
                }
                break;
            case "LTE":
            case "LT":
                if (!(tablequery._.isUndefined(duration))) {
                    var date_range = moment().range(moment(0),
                                                    moment(now - duration).endOf('day'));
                } else {
                    var date_range = moment().range(moment(0),
                                                    moment(datetime));
                }
                break;
            case "GTE":
            case "GT":
                if (!(tablequery._.isUndefined(duration))) {
                    var date_range = moment().range(moment(now - duration).startOf('day'),
                                                    moment("9999"));
                } else {
                    var date_range = moment().range(moment(datetime),
                                                    moment("9999"));
                }
                break;
        }
        return date_range;
    }

    _isNumber = function(string) {
        return /^[0-9]+$/.test(string);
    }
    _isNumber = tablequery._.memoize(_isNumber);
})());
