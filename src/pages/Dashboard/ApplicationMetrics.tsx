import React, { FC, useState, useEffect } from 'react';
import { Box, Container, Card, CardHeader, CardContent, Divider, Grid } from '@mui/material';
import {
    Chart, Series, ArgumentAxis, CommonSeriesSettings, Legend, Tooltip, Grid as ChartGrid, ValueAxis, Label, Connector
} from 'devextreme-react/chart';
import PieChart, { Export } from 'devextreme-react/pie-chart';
import LoadingScreen from 'src/components/Basic/LoadingScreen';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
import { fetchApplications } from 'src/reducers/applications/applicationsSlice';
import { fetchRoles } from 'src/reducers/roles/rolesSlice';
import { fetchApplicationPerDayMin, fetchApplicationPerDayNumber, fetchApplicationTotalPercent, fetchApplicationCategory } from 'src/reducers/loginReports/loginReportsSlice';
import { Application } from 'src/reducers/applications/applicationsAPI';
import { Role } from 'src/reducers/roles/rolesAPI';
import { Metrics } from 'src/reducers/loginReports/loginReportsAPI';

interface MetricsData {
    [key: string]: string | number | undefined
}

function customizeTooltip(arg: { seriesName: string; valueText: string; }) {
    return {
        text: `${arg.seriesName}: ${arg.valueText}`,
    };
}

const ApplicationMetrics: FC = () => {
    const dispatch = useAppDispatch();
    const applications = useSelector((state: RootState) => state.applications.allApplications); // application names
    const roles = useSelector((state: RootState) => state.roles.allRoles); // roles
    const perDayMin = useSelector((state: RootState) => state.loginReports.applicationPerDayMin); // Metrics top-left
    const perDayNumber = useSelector((state: RootState) => state.loginReports.applicationPerDayNumber); // Metrics bottom-left
    const totalPercent = useSelector((state: RootState) => state.loginReports.applicationPercent); // Metrics top-right
    const roleApplications = useSelector((state: RootState) => state.loginReports.applicationRoles); // Metrics bottom-right
    const users = useSelector((state: RootState) => state.loginReports.applicationUsers); // Metrics bottom-right

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [applicationNames, setApplicationNames] = useState<any[]>([]);
    const [roleNames, setRoleNames] = useState<any[]>([]);
    const [metricsPerDayMin, setMetricsPerDayMin] = useState<MetricsData[]>([]); // Chart top-left
    const [metricsPerDayNumber, setMetricsPerDayNumber] = useState<MetricsData[]>([]); // Chart bottom-left
    const [metricsTotalPercent, setMetricsTotalPercent] = useState<MetricsData[]>([]); // Chart top-right
    const [metricsCategory, setMetricsCategory] = useState<MetricsData[]>([]); // Chart bottom-right
    const customColors = ['#118DFF', '#12239E', '#E66C37', '#6B007B', '#E044A7', '#744EC2', '#D9B300', '#D64550', '#197278', '#1AAB40', '#15C6F4', '#4092FF'];

    useEffect(() => {
        dispatch(fetchApplications());
        dispatch(fetchRoles());
        dispatch(fetchApplicationPerDayMin());
        dispatch(fetchApplicationPerDayNumber());
        dispatch(fetchApplicationTotalPercent());
        dispatch(fetchApplicationCategory());
    }, [dispatch]);

    useEffect(() => {
        if (applications.length > 0 && roles.length > 0 && perDayMin.length > 0 && perDayNumber.length > 0 &&
            totalPercent.length > 0 && roleApplications.length > 0 && users.length > 0) {
            const temp_applications = applications.map((row: Application, index) => {
                return { value: "application" + index, name: row.name, id: row.id }
            });
            const temp_roles = roles.map((row: Role, index) => {
                return { value: "role" + index, name: row.name, id: row.id }
            });

            const uniqueDates = perDayMin
                .map((row: Metrics) => row.usage_date)
                .filter((date, index, self) => date !== undefined && self.indexOf(date) === index);

            const temp_metricsPerDayMin = uniqueDates.map((date: string | undefined) => {
                const result: MetricsData = { date };

                temp_applications.forEach(app => {
                    const appMetrics = perDayMin.find(
                        (row: Metrics) => row.usage_date === date && row.application_id === app.id
                    );
                    result[app.value] = appMetrics ? appMetrics.usage_time : 0;
                });
                return result;
            });

            const temp_metricsPerDayNumber = uniqueDates.map((date: string | undefined) => {
                const result: MetricsData = { date };

                temp_applications.forEach(app => {
                    const appMetrics = perDayNumber.find(
                        (row: Metrics) => row.usage_date === date && row.application_id === app.id
                    );
                    result[app.value] = appMetrics ? appMetrics.usage_users : 0;
                });
                return result;
            });

            const temp_totalPercent = temp_applications.map((app) => {
                return { application: app.name, percent: totalPercent.filter(row => row.application_id === app.id).map(row => row.usage_percent)[0] };
            });

            const temp_category = temp_applications.map(app => {
                const result: MetricsData = { application: app.name };
                temp_roles.forEach(role => {
                    const roleApplication = roleApplications.find(
                        (row) => role.name === row.role_name && app.name === row.application_name
                    );
                    result[role.value] = roleApplication ? (users.filter(user => user.role_ids?.includes(role.id)).length) : 0;
                });
                return result;
            });

            setApplicationNames(temp_applications);
            setRoleNames(temp_roles);
            setMetricsPerDayMin(temp_metricsPerDayMin);
            setMetricsPerDayNumber(temp_metricsPerDayNumber);
            setMetricsTotalPercent(temp_totalPercent);
            setMetricsCategory(temp_category);
            setIsLoading(false);
        }
    }, [applications, perDayMin, perDayNumber, totalPercent, roles, roleApplications, users])

    return (
        <Container maxWidth={false}>
            <LoadingScreen show={isLoading} />
            <Box sx={{ pt: 3 }}>
                <Card variant="outlined">
                    <CardHeader title="Access Metrics" />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                {metricsPerDayMin.length > 0 && (
                                    <Chart dataSource={metricsPerDayMin}
                                        title={{
                                            text: 'Application Usage Time (Min/Day)',
                                            font: {
                                                weight: 700,
                                                size: 20,
                                                color: '#e34747'
                                            },
                                            horizontalAlignment: 'center'
                                        }}
                                    >
                                        <CommonSeriesSettings argumentField="date" type="line" />
                                        {applicationNames.map((item, index) => (
                                            <Series key={item.value} valueField={item.value} name={item.name} color={customColors[index]} />
                                        ))}
                                        <ValueAxis title="Time" />
                                        <ArgumentAxis title="Date">
                                            <ChartGrid visible={true} />
                                        </ArgumentAxis>
                                        <Legend
                                            verticalAlignment="bottom"
                                            horizontalAlignment="center"
                                            itemTextPosition="bottom"
                                        />
                                        <Export enabled={true} />
                                        <Tooltip
                                            enabled={true}
                                            location="edge"
                                            customizeTooltip={customizeTooltip}
                                        />
                                    </Chart>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                {metricsTotalPercent.length > 0 && (
                                    <PieChart
                                        id="pie"
                                        title={{
                                            text: 'Total Application Usage Time (T%)',
                                            font: {
                                                weight: 700,
                                                size: 20,
                                                color: '#e34747'
                                            },
                                            horizontalAlignment: 'center'
                                        }}
                                        dataSource={metricsTotalPercent}
                                        customizePoint={(pointInfo) => {
                                            const colorIndex = pointInfo.index % customColors.length;
                                            return { color: customColors[colorIndex] };
                                        }}
                                    >
                                        <Series argumentField="application" valueField="percent">
                                            <Label visible={true}>
                                                <Connector visible={true} width={1} />
                                            </Label>
                                        </Series>
                                        <Export enabled={true} />
                                    </PieChart>
                                )}
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} mt={2}>
                            <Grid item xs={6}>
                                {metricsPerDayNumber.length > 0 && (
                                    <Chart dataSource={metricsPerDayNumber}
                                        title={{
                                            text: 'Total Users Per Day',
                                            font: {
                                                weight: 700,
                                                size: 20,
                                                color: '#e34747'
                                            },
                                            horizontalAlignment: 'center'
                                        }}
                                    >
                                        <CommonSeriesSettings argumentField="date" type="stackedbar" />
                                        {applicationNames.map((item, index) => (
                                            <Series key={item.value} valueField={item.value} name={item.name} color={customColors[index]} />
                                        ))}
                                        <ValueAxis title="Users" />
                                        <ArgumentAxis title="Date">
                                            <ChartGrid visible={true} />
                                        </ArgumentAxis>
                                        <Legend
                                            verticalAlignment="bottom"
                                            horizontalAlignment="center"
                                            itemTextPosition="bottom"
                                        />
                                        <Export enabled={true} />
                                        <Tooltip
                                            enabled={true}
                                            location="edge"
                                            customizeTooltip={customizeTooltip}
                                        />
                                    </Chart>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                {metricsCategory.length > 0 && (
                                    <Chart dataSource={metricsCategory}
                                        title={{
                                            text: 'Roles Login Per Application',
                                            font: {
                                                weight: 700,
                                                size: 20,
                                                color: '#e34747'
                                            },
                                            horizontalAlignment: 'center'
                                        }}
                                    >
                                        <CommonSeriesSettings argumentField="application" type="stackedbar" />
                                        {roleNames.map((item, index) => (
                                            <Series key={item.value} valueField={item.value} name={item.name} color={customColors[index]} />
                                        ))}
                                        <ValueAxis title="Users" />
                                        <ArgumentAxis title="Application">
                                            <ChartGrid visible={true} />
                                        </ArgumentAxis>
                                        <Legend
                                            verticalAlignment="bottom"
                                            horizontalAlignment="center"
                                            itemTextPosition="bottom"
                                        />
                                        <Export enabled={true} />
                                        <Tooltip
                                            enabled={true}
                                            location="edge"
                                            customizeTooltip={customizeTooltip}
                                        />
                                    </Chart>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Container>

    );
};

export default ApplicationMetrics;
