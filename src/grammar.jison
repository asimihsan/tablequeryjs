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

/* References:

-   Udacity course on Programming Languages
-   Stanford course on Compilers
-   https://github.com/stanistan/aql-parser-js/blob/master/src/lang/grammar.jison
-   https://github.com/stanistan/aql-parser-js/blob/master/src/lang/lexer.jisonlex
-   http://stackoverflow.com/questions/12566964/expression-ast-parser-from-expression-interpreter-demo/12568601#12568601

/* lexical grammar */
%lex
%options flex case-insensitive
%%

\s*\n\s*                  /* ignore */

[\w]?\"(\\.|[^\\"])*\"    return 'STRING_LITERAL_D';
[\w]?\'(\\.|[^\\'])*\'    return 'STRING_LITERAL_S';

"("                       return 'LPAREN';
")"                       return 'RPAREN';

"not"                     return 'NOT';
"!"                       return 'NOT';

"in"                      return 'IN';
">="                      return 'GTE';
"<="                      return 'LTE';
">"                       return 'GT';
"<"                       return 'LT';
"=="                      return 'EQ';
"="                       return 'EQ';
"!="                      return 'NEQ';

"like"                    return 'LIKE';
"~"                       return 'LIKE';
"!~"                      return 'NLIKE';
"ilike"                   return 'ILIKE';
"~*"                      return 'ILIKE';
"!~*"                     return 'NILIKE';

"and"                     return 'AND';
"&&"                      return 'AND';
"or"                      return 'OR';
"||"                      return 'OR';

[A-Za-z0-9_\-\.:]+        return 'IDENT';

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
            {  
               //typeof console !== 'undefined' ? console.log($1) : print($1);
               return $1;
            }
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
    |   literal NEQ literal
            {$$ = ["NEQ", $1.toLowerCase(), $3];}
    |   literal LIKE literal
            {$$ = ["LIKE", $1.toLowerCase(), $3];}
    |   literal ILIKE literal
            {$$ = ["ILIKE", $1.toLowerCase(), $3];}
    |   literal NLIKE literal
            {$$ = ["NLIKE", $1.toLowerCase(), $3];}
    |   literal NILIKE literal
            {$$ = ["NILIKE", $1.toLowerCase(), $3];}
    |   literal GT literal
            {$$ = ["GT", $1.toLowerCase(), $3];}
    |   literal GTE literal
            {$$ = ["GTE", $1.toLowerCase(), $3];}
    |   literal LT literal
            {$$ = ["LT", $1.toLowerCase(), $3];}
    |   literal LTE literal
            {$$ = ["LTE", $1.toLowerCase(), $3];}
    |   literal
        {$$ = ["ILIKE_ANY", $1]}
    ;

literal
    :   STRING_LITERAL_S
            {$$ = $1.substring(1, $1.length - 1);}
    |   STRING_LITERAL_D
            {$$ = $1.substring(1, $1.length - 1);}
    |   IDENT
            {$$ = $1;}
    ;

