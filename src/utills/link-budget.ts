import JSONataService, { createLossHolder } from "../services/link-budget/jsonata";
import ParserService from "../services/link-budget/parser";
import { ParamGroup, Row } from "../components/link-budget/types/LinkBudgetTypes";

export async function calculateRowsData(rowsData: Row[], sourceData: ParamGroup): Promise<Row[]> {

    const newRowsData: Row[] = [];
    const parserService = new ParserService();
    const jsonataService = new JSONataService();
    const lossHolder = createLossHolder(sourceData);

    for (const row of rowsData) {
        const rowData: Row = { ...row };
        const jsonata_exp = parserService.getJsonataExpression(row.user_exp);

        try {
            const expression = await jsonataService.getExpression(jsonata_exp, sourceData, lossHolder);
            const result: any = await expression.evaluate({ items: newRowsData });

            rowData.value = result === undefined ? '!ERROR' : result;
            rowData.jsonata_exp = jsonata_exp;
        } catch (err: any) {
            if (err.code === 'T1006') {
                rowData.value = '!ERROR';
                rowData.jsonata_exp = jsonata_exp;
            }
        }

        newRowsData.push(rowData);
    }

    return newRowsData;
}