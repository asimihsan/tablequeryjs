/**
  * @license
  * tablequeryjs by Asim Ihsan (http://www.asimihsan.com)
  * https://github.com/asimihsan/tablequeryjs
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

var table; // = $("table");
var table_parent;
var table_tbody_rows;
var table_search_text; // = $("#table_search_text");
var table_search_text_control_group; // = table_search_text.closest(".control-group");

var parser_exception_message;
var previous_search_text = new Array();
var table_headings = {};
var table_search_text_keyup_timer;

tablequery._get_rows_to_display = function(trees) {
    console.log("get_rows_to_display.");
    console.log(trees);
    var return_value;
    var node_type = trees[0];
    var left = trees[1];
    if (trees.length == 3) {
        var right = trees[2];
    }
    if (!($.isArray(left))) {
        console.log("Child nodes.");
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
        } // switch(node_type)
        var test_for_true = node_type.substring(0,1) != "N";
        if (left in table_headings) {
            console.log("left value in table_headings.");
            var column_index = table_headings[left];
            return_value = table_tbody_rows.filter(function(i) {
                text = $(this).children()[column_index].textContent;
                text = $.trim(text);
                regexp_result = expr.test(text);
                if (test_for_true) {
                    return regexp_result;
                } else {
                    return !regexp_result;
                }
            });
        } // if (left in table_headings)
    } else {
        console.log("Interior nodes.");
        var left_trees = tablequery._get_rows_to_display(left);
        if (trees.length == 3) {
            var right_trees = tablequery._get_rows_to_display(right);
        }
        switch(node_type) {
            case "AND":
                console.log("AND");
                return_value = tablequery._.intersection(left_trees, right_trees);
                break;
            case "OR":
                console.log("OR");
                return_value = tablequery._.union(left_trees, right_trees);
                break;
            case "NOT":
                console.log("NOT");
                var left_tree_indices = {}
                tablequery._.each(left_trees, function(obj) { left_tree_indices[$(obj).index()] = true; });
                return_value = tablequery._.filter(table_tbody_rows, function(row) {
                    return !($(row).index() in left_tree_indices);
                });
        } // switch(node_type)
    } // if (!($.isArray(left)))
    if (!return_value) {
        console.log("no return value, return all rows.");
        return_value = table_tbody_rows;
    }
    return_value = $(return_value);
    console.log("returning")
    console.log(return_value);
    return return_value;
}
tablequery._get_rows_to_display = tablequery._.memoize(tablequery._get_rows_to_display);

tablequery._parse_search_text = function(search_text) {
    var is_parse_successful = true;
    var parsed_query;
    try {
        parsed_query = grammar.parse(search_text);
    } catch(e) {
        parser_exception_message = e.message;
        is_parse_successful = false;
    }
    return {"rc": is_parse_successful, "parsed_query": parsed_query};
}

tablequery._update_table_search_text_warning = function(is_parse_successful, clear) {
    if ((table_search_text.val().length == 0) || (clear)) {
        table_search_text_control_group.removeClass("error");
        table_search_text_control_group.removeClass("success");
    } else if (is_parse_successful) {
        table_search_text_control_group.removeClass("error");
        table_search_text_control_group.addClass("success");
    } else {
        table_search_text_control_group.addClass("error");
        table_search_text_control_group.removeClass("success");
    }
}

tablequery._update_table_headings = function() {
    $.map(table.find("th"), function(el, i) {
        table_headings[$.trim(el.textContent.toLowerCase())] = i;
    });
    console.log(table_headings);
}

tablequery.set_table = function(selector) {
    table = $(selector);
    table_parent = table.parent();
    table_tbody_rows = table.find("tbody tr");
    tablequery._update_table_headings();
}

var previous_query_failed;
tablequery.set_table_search_text = function(selector) {
    table_search_text = $(selector);
    table_search_text_control_group = table_search_text.closest(".control-group");

    tablequery._table_search_text_on_keyup = function(e, text_value) {
        var rv = tablequery._parse_search_text(text_value);
        tablequery._update_table_search_text_warning(rv.rc, false);
        if (rv.rc) {
            previous_query_failed = false;
            var rows_to_display = tablequery._get_rows_to_display(rv.parsed_query);
            table.detach();
            table_tbody_rows.addClass('hidden');
            rows_to_display.removeClass('hidden');
            table_parent.append(table);
            tablequery._update_previous_search_text();
        } else {
            if (!previous_query_failed) {
                table_tbody_rows.removeClass('hidden');
            }
            previous_query_failed = true;
        }
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

    // --------------------------------------------------------------------
    //  Auto-completing and storing/restoring query history.
    // --------------------------------------------------------------------
    tablequery._update_previous_search_text = function() {
        if (tablequery._.contains(previous_search_text, table_search_text.val())) {
            return;
        }
        previous_search_text.push(table_search_text.val());
        if (previous_search_text.length > 5) {
            previous_search_text = previous_search_text.slice(1);
        }
        if (tablequery.Modernizr.localstorage) {
            localStorage.previous_search_text = JSON.stringify(previous_search_text);
            table_search_text.autocomplete({
                source: previous_search_text,
                minLength: 0
            });
        }
    } // tablequery._update_previous_search_text

    if (tablequery.Modernizr.localstorage) {
        try {
            previous_search_text = JSON.parse(localStorage.previous_search_text);
        } catch (e) {
            previous_search_text = [];
        }
        tablequery._.each(previous_search_text, function(text_value) {
            var rv = tablequery._parse_search_text(text_value);
            if (rv.rc) {
                var rows_to_display = tablequery._get_rows_to_display(rv.parsed_query);
            }
        });
        table_search_text.autocomplete({
            source: previous_search_text,
            minLength: 0,
            select: function( event, ui ) {}
        });
        table_search_text.on("autocompleteselect", function(event, ui) {
            tablequery._table_search_text_on_keyup(null, ui.item.value);
        });
        table_search_text.click(function() {
            table_search_text.autocomplete("search", "");
        });
    } // if (tablequery.Modernizr.localstorage)
    // --------------------------------------------------------------------
}
