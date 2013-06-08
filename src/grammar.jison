/* References:

-   Udacity course on Programming Languages
-   Stanford course on Compilers
-   https://github.com/stanistan/aql-parser-js/blob/master/src/lang/grammar.jison
-   https://github.com/stanistan/aql-parser-js/blob/master/src/lang/lexer.jisonlex
-   http://stackoverflow.com/questions/12566964/expression-ast-parser-from-expression-interpreter-demo/12568601#12568601

/* lexical grammar */
%lex
%%

\s*\n\s*                  /* ignore */

[\w]?\"(\\.|[^\\"])*\"    return 'STRING_LITERAL_D';
[\w]?\'(\\.|[^\\'])*\'    return 'STRING_LITERAL_S';

"("                       return 'LPAREN';
")"                       return 'RPAREN';

"not"                     return 'NOT';

"in"                      return 'IN';
">="                      return 'GTE';
"<="                      return 'LTE';
">"                       return 'GT';
"<"                       return 'LT';
"=="                      return 'EQ';
"="                       return 'EQ';
"like"                    return 'LIKE';
"ilike"                   return 'ILIKE';
"and"                     return 'AND';
"or"                      return 'OR';

[A-Za-z0-9_\-\.]+         return 'IDENT';

\s+                       /* */
.                         return 'INVALID';
<<EOF>>                   return 'EOF';

/lex

/* operator associations and precedence */
%right OR AND
%left EQ LIKE ILIKE IN GTE GT LTE LT
%left NOT

/* start symbol */
%start statement

%% /* language grammar */

statement
    :   query EOF
            {  typeof console !== 'undefined' ? console.log($1) : print($1);
               return $1; }
    ;

query
    :   LPAREN query RPAREN
            {$$ = $2;}
    |   query AND query
            {$$ = ["AND", $1, $3];}
    |   query OR query
            {$$ = ["OR", $1, $3];}
    |   NOT query
            {$$ = ["NOT", $2]}
    |   literal EQ literal
            {$$ = ["EQ", $1.toLowerCase(), $3];}
    |   literal LIKE literal
            {$$ = ["LIKE", $1.toLowerCase(), $3];}
    |   literal ILIKE literal
            {$$ = ["ILIKE", $1.toLowerCase(), $3];}
    ;

literal
    :   STRING_LITERAL_S
            {$$ = $1.substring(1, $1.length - 1);}
    |   STRING_LITERAL_D
            {$$ = $1.substring(0, $1.length - 1);}
    |   IDENT
            {$$ = $1;}
    ;

