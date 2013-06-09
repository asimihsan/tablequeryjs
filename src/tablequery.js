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

(function(tablequery, $, undefined) {
    var table; // = $("table");
    var table_search_text; // = $("#table_search_text");
    var table_search_text_control_group; // = table_search_text.closest(".control-group");

    var parser_exception_message;
    var previous_search_text;
    var table_headings = {};

    get_rows_to_display = function(trees) {
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
            }
            var test_for_true = node_type.substring(0,1) != "N";
            if (left in table_headings) {
                console.log("left value in table_headings.");
                var column_index = table_headings[left];
                return_value = table.find("tbody tr").filter(function(i) {
                    text = $(this).children()[column_index].textContent;
                    regexp_result = expr.test(text);
                    if (test_for_true) {
                        return regexp_result;
                    } else {
                        return !regexp_result;
                    }
                });
            }
        } else {
            console.log("Interior nodes.");
            var left_trees = get_rows_to_display(left);
            if (trees.length == 3) {
                var right_trees = get_rows_to_display(right);    
            }
            if (node_type == "AND") {
                console.log("AND");
                return_value = _.intersection(left_trees, right_trees);
            } else if (node_type == "OR") {
                console.log("OR");
                return_value = _.union(left_trees, right_trees);
            } else if (node_type == "NOT") {
                console.log("NOT");

                // Infuriatingly, this doesn't work, because no matter what
                // I do I can't get elements to match under ===. Why?
                // return_value = _.difference($("table tbody tr"), left_trees);

                return_value = _.filter(table.find("tbody tr"), function(el) {
                    var el_in_left_trees = false;
                    _.each(left_trees, function(el2) {
                        if ($(el).index() == $(el2).index()) {
                            el_in_left_trees = true;
                        }
                    });
                    return !el_in_left_trees;
                });
            }
        }
        if (!return_value) {
            console.log("no return value, return all rows.");
            return_value = table.find("tbody tr");
        }
        console.log("returning")
        console.log(return_value);
        return return_value;
    }

    parse_search_text = function(search_text) {
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

    update_table_search_text_warning = function(is_parse_successful) {
        if (table_search_text.val().length == 0) {
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

    maybe_update_table_headings = function() {
        if (_.isEmpty(table_headings)) {
            $.map(table.find("th"), function(el, i) {
                table_headings[el.textContent.toLowerCase()] = i; 
            });
            console.log(table_headings);
        }            
    }

    tablequery.set_table = function(selector) {
        table = $(selector);
    }

    tablequery.set_table_search_text = function(selector) {
        table_search_text = $(selector);
        table_search_text_control_group = table_search_text.closest(".control-group");
        table_search_text.keyup(function(e) {
            maybe_update_table_headings();
            if ($(this).val() == previous_search_text) {
                return false;
            }
            var rv = parse_search_text($(this).val())
            update_table_search_text_warning(rv.rc);
            if (rv.rc) {
                var rows_to_display = get_rows_to_display(rv.parsed_query);
                table.find("tbody tr").hide();
                _.each(rows_to_display, function(row) { $(row).show(); });
                console.log(rows_to_display);
            } else {
                table.find("tbody tr").show();
            }
            previous_search_text = $(this).val();
        });

        table_search_text.keypress(function(e) {
           return (e.keyCode || e.which || e.charCode || 0) !== 13; 
        });
    }

}(window.tablequery = window.tablequery || {}, jQuery));
