/*

'first name' ilike Mark
'first name' like r
'first name' like Mark or number = 3
number = 3
number == 3
not number == 3
not 'first name' ilike mark
not ('first name' ilike mark or number = 2)

*/


$(document).ready(function() {
    var parsed_query;
    var parser_exception_message;
    var previous_search_text;
    var table_headings = {};
    $.map($("#table th"), function(el, i) {
        table_headings[el.textContent.toLowerCase()] = i; 
    });
    console.log(table_headings);

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
            if (node_type == "EQ") {
                var expr = new RegExp("^" + right + "$");
            } else if (node_type == "ILIKE") {
                var expr = new RegExp(right, "i");
            } else {
                var expr = new RegExp(right);
            }
            if (left in table_headings) {
                console.log("left value in table_headings.");
                var column_index = table_headings[left];
                return_value = $("table tbody tr").filter(function(i) {
                    text = $(this).children()[column_index].textContent;
                    return expr.test(text);
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

                return_value = _.filter($("table tbody tr"), function(el) {
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
            return_value = $("table tbody tr");
        }
        console.log("returning")
        console.log(return_value);
        return return_value;
    }

    parse_search_text = function(search_text) {
        is_parse_successful = true;
        try {
            parsed_query = grammar.parse(search_text);
        } catch(e) {
            parser_exception_message = e.message;
            is_parse_successful = false;
        }
        return is_parse_successful;        
    }

    update_table_search_text_warning = function() {
        if ($("#table_search_text").val().length == 0) {
            $("#table_search_text_control_group").removeClass("error");
            $("#table_search_text_control_group").removeClass("success");
        } else if (is_parse_successful) {
            $("#table_search_text_control_group").removeClass("error");
            $("#table_search_text_control_group").addClass("success");
        } else {
            $("#table_search_text_control_group").addClass("error");
            $("#table_search_text_control_group").removeClass("success");
        }        
    }

    $("#table_search_text").keyup(function(e) {
        if ($(this).val() == previous_search_text) {
            return false;
        }
        rc = parse_search_text($(this).val())
        update_table_search_text_warning(rc);
        if (rc) {
            rows_to_display = get_rows_to_display(parsed_query);
            $("#table tbody tr").hide();
            _.each(rows_to_display, function(row) { $(row).show(); });
            console.log(rows_to_display);
        } else {
            $("#table tbody tr").show();
        }
        previous_search_text = $(this).val();
    });

    $("#table_search_text").keypress(function(e) {
       return (e.keyCode || e.which || e.charCode || 0) !== 13; 
    });

    $("#table_search_error").hide();

});
