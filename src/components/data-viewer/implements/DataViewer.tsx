import React, { FC, useEffect, useState } from "react";
import { Box, Card, CardHeader, Container, Divider } from "@mui/material";
import DVSideBar from "./DVSideBar";
import DVContent from "./DVContent";
import { Query } from "../types/dataViewer";
import { dataApiService } from "../../../services";

const DataViewer: FC = () => {
    const [queries, setQueries] = useState<Query[]>([]);
    const [activeQuery, setActiveQuery] = useState<Query | undefined>(undefined);

    useEffect(() => {
        getQueryData();
    }, []);

    /**
     * Get Query Data
     */
    const getQueryData = async () => {
        try {
            const getResponse = await dataApiService.getQueries();
            if (getResponse.data) {
                setQueries(getResponse.data);
                const internalQueries = getResponse.data.filter((query: Query) => query.isExternal === false);

                // Set first internal Query as Active
                if (internalQueries.length > 0 && activeQuery === undefined) {
                    setActiveQuery(internalQueries[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch queries", error);
            // Optionally set some error state or notify the user
        }
    };

    /**
     * Handle Query Change
     */
    const handleOnChange = (query: Query) => {
        setActiveQuery(query);
    };

    return (
        <Container maxWidth={false} sx={{ paddingTop: 1 }}>
            <Card>
                <CardHeader title={activeQuery?.name || "No Active Query"} />
                <Divider />
                <Box sx={{ display: "flex", height: '100%' }}>
                    <DVSideBar query={activeQuery} queries={queries} onChange={handleOnChange} />
                    <DVContent query={activeQuery} />
                </Box>
            </Card>
        </Container>
    );
};

export default DataViewer;
