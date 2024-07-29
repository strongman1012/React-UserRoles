export default class ParserService {
    symbols: string[];
    functionPrefix: string;
    startSymbol: string;

    constructor() {
        this.symbols = ['+', '-', '*', '/', '(', ')', '([', '])', '[', ']', ',', ')+'];
        this.functionPrefix = '$';
        this.startSymbol = '=';
    }

    /**
     * Get Parsed Array with variables and numbers and symbols
     * @param user_exp 
     * @returns 
     */
    getParserArray(user_exp: string): string[] {
        const copy = user_exp;
        user_exp = user_exp.replace(/[A-Za-z_$0-9]+/g, "#").replace(/[||. ]/g, "");
        const variables = copy.split(/[^A-Za-z_$0-9.]+/);
        const operators = user_exp.split("#").filter(function (n) { return n });
        const result: any[] = [];

        variables.forEach((v: any, idx: number) => {
            result.push(v);
            idx < operators.length && result.push(operators[idx]);
        });

        return result;
    }

    /**
     * Get Jsonata Expression from User added Expression
     * @param str 
     * @returns 
     */
    getJsonataExpression(str: string): string {

        let user_exp = str;

        if (user_exp.charAt(0) === this.startSymbol) {
            user_exp = user_exp.substring(1);
        }

        let expression = '';
        if (this.inString(user_exp)) {
            expression = user_exp;
        } else {
            const parsedArray = this.getParserArray(user_exp);

            parsedArray.forEach((v: string) => {
                //If it has ANY symbol, treat it as a symbol.
                if (this.symbols.map(e => v.split("").includes(e)).includes(true) || v.includes(this.functionPrefix)) {
                    expression += v;
                } else {
                    // isNaN(Number(v)) means variable
                    expression += isNaN(Number(v)) ? `items[name="${v}"].value` : v
                }
            });
        }

        return expression;
    }

    inString(s: string): boolean {
        const matched = s.match(/'[^']*'/g) || s.match(/"[^"]*"/g);
        return matched !== null ? true : false;
    }
}