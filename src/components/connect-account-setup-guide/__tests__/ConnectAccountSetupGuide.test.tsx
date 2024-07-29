// ConnectAccountSetupGuide.test.tsx
import { render, fireEvent, screen, waitFor, act } from "@testing-library/react";
import ConnectAccountSetupGuide from "../implements/ConnectAccountSetupGuide";
import '@testing-library/jest-dom';
import AwsRegisterForm from "../implements/AwsRegister";
import axios from 'axios';
import AwsResources from "../implements/AwsResources";
import AwsAccountVerify from "../implements/AwsAccountVerify";
import AzureRegisterForm from "../implements/AzureRegister";
import AzureResources from "../implements/AzureResources";
import AzureAccountVerify from "../implements/AzureAccountVerify";
import ServerApi from "src/utills/serverApi";

jest.mock('axios');

describe('Space Connect Setup Guide component', () => {

    beforeEach(() => {
        render(<ConnectAccountSetupGuide />);
    });

    it('Renders first step correctly initial document', () => {
        const componentTitle = screen.getByText(/Setup Your Account/i);
        expect(componentTitle).toBeInTheDocument();
    });

    it('Moves to the register step when Next button is clicked', async () => {

        jest.mock('src/utills/serverApi', () => {
            return jest.fn().mockImplementation(() => {
                return {
                    getData: jest.fn().mockResolvedValue({ 
                        status: 200, 
                        data: { 
                            success: true,
                            data: {
                                "_id": "1",
                                "type": "awsCredential",
                                "__v": 0,
                                "accessKeyId": "mockAccessKeyId",
                                "createdAt": "2023-12-19T16:35:51.067Z",
                                "region": "eu-north-1",
                                "secretAccessKey": "mockSecretAccessKey",
                                "updatedAt": "2024-02-14T08:14:02.032Z"
                            }
                        } 
                    })
                };
            });
        });

        const nextToRegsiterButton = screen.getByRole('button', { name: /Next/i });

        // Simulate clicking the "Next" button
        fireEvent.click(nextToRegsiterButton);

        /**
         * Moving To Register Step
         */
        await waitFor(() => {
            const registerTitle = screen.getByText(/Do you have an account/i);

            // Assert that the screen is now displaying the next step
            expect(registerTitle).toBeInTheDocument();
        });

        // Prepare for next page
        const mockAwsResourceStatus = `{
            "onboard": true,
            "vpc": true,
            "ec2": true,
            "stack": true
        }`;

        const getItemMock = jest.spyOn(window.localStorage.__proto__, 'getItem');
        getItemMock.mockReturnValueOnce(mockAwsResourceStatus);

        const nextToResources = screen.getByRole('button', { name: /Next/i });
        fireEvent.click(nextToResources);

        /**
         * Wait move to Resource Step
         */
        await waitFor(() => {
            const onboardingTitle = screen.getByText(/1. Onboarding Satellites/i);
            expect(onboardingTitle).toBeInTheDocument();
            expect(screen.getByText(/2. Create a VPC/i)).toBeInTheDocument();
            expect(screen.getByText(/3. Create a EC2 instance/i)).toBeInTheDocument();
            expect(screen.getByText(/4. Create a CloudFormation/i)).toBeInTheDocument();
        });

        // Prepare for next page
        const nextToVerify = screen.getByRole('button', { name: /Next/i });
        expect(nextToVerify).not.toBeDisabled();

        act(() => {
            fireEvent.click(nextToVerify);
        });

        await waitFor(() => {
            const finishButton = screen.getByRole('button', { name: /Finish/i });
            expect(finishButton).toBeInTheDocument();
        });
        
    });
});

describe('AwsRegisterForm Component', () => {

    const mockAwsData = {
        "_id": "1",
        "type": "awsCredential",
        "__v": 0,
        "accessKeyId": "mockAccessKeyId",
        "createdAt": "2023-12-19T16:35:51.067Z",
        "region": "eu-north-1",
        "secretAccessKey": "mockSecretAccessKey",
        "updatedAt": "2024-02-14T08:14:02.032Z"
    }

    beforeEach(() => {
        render(<AwsRegisterForm />);

        jest.mock('src/utills/serverApi', () => {
            return jest.fn().mockImplementation(() => {
                return {
                    getData: jest.fn().mockResolvedValue(
                        { 
                            status: 200, 
                            data: mockAwsData
                        }
                    )
                };
            });
        });
    });

    it('Renders form with initial values', async () => {

        // Check if the form fields are rendered with initial values
        expect(screen.getByText(/AWS Access Key ID:/i)).toBeInTheDocument();
        expect(screen.getByText(/AWS Secret Access Key:/i)).toBeInTheDocument();
        expect(screen.getByText(/Region:/i)).toBeInTheDocument();

        // Check if the submit button is rendered
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('loads subscription data on mount', async () => {
        // Mocked data to simulate a successful response from the server
        const mockData = {
            status: 200,
            data: {
                success: true,
                data: {
                    type: 'awsCredential',
                    accessKeyId: '',
                    secretAccessKey: '',
                    region: ''
                }
            }
        };

        // Mock the axios.get function
        const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;
        // Mock the resolved value of the axios.get function
        mockedAxiosGet.mockResolvedValueOnce(mockData);

        // You may need to adjust these expectations based on how your component handles loading states and displays data
        await waitFor(() => {
            expect(document.querySelector('input[name="accessKeyId"]')).toHaveValue(mockData.data.data.accessKeyId);
            expect(document.querySelector('input[name="secretAccessKey"]')).toHaveValue(mockData.data.data.secretAccessKey);
            expect(document.querySelector('input[name="region"]')).toHaveValue(mockData.data.data.region);
        });
    });

    // Not passed
    it('Submits form with valid data', async () => {

        // Define MockData
        const mockAwsStoreData = {
            accessKeyId: 'mockAccessKey',
            secretAccessKey: 'mockSecretKey',
            region: 'eu-north-1'
        }

        jest.mock('src/utills/serverApi', () => {
            return jest.fn().mockImplementation(() => {
                return {
                    postData: jest.fn().mockResolvedValue({ 
                        status: 201, 
                        data: { 
                            success: true
                        } 
                    })
                };
            });
        });

        // Fill out the form with valid data
        fireEvent.change(screen.getByLabelText('Add aws access key Id'), { target: { value: mockAwsStoreData.accessKeyId } });
        fireEvent.change(screen.getByLabelText('Add secret access key'), { target: { value: mockAwsStoreData.secretAccessKey } });
        fireEvent.change(screen.getByLabelText('Add region'), { target: { value: mockAwsStoreData.region } });
        
        // Submit the form
        fireEvent.click(screen.getByText(/Submit/i));

        // Wait for form submission to complete
        await waitFor(() => {
            // Assert that axios.post was called with the correct data
            expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
        });
    });
});

describe('AwsResource Component', () => {

    it('renders correctly', () => {
        const onCompletedMock = jest.fn();
        const { getByText } =  render(<AwsResources onCompleted={onCompletedMock} />);
        expect(getByText('1. Onboarding Satellites')).toBeInTheDocument();
    });

    it('clicking on Done button updates state and disables the button', () => {
        const onCompletedMock = jest.fn();
        const { getByTestId } = render(<AwsResources onCompleted={onCompletedMock} />);
        const doneButton = getByTestId('btn-done-ec2');

        expect(doneButton).not.toBeDisabled();
        fireEvent.click(doneButton);
        expect(doneButton).toBeDisabled();
    });
});

describe('AwsAccountVerify Component', () => {

    // Mock the API object
    const mockApiObj = {
        getData: jest.fn(),
    };

    // Mock the API object
    jest.mock('src/utills/serverApi');

    it('renders correctly', async () => {
        const onCompletedMock = jest.fn();
        const { findByText } = render(<AwsAccountVerify onCompleted={onCompletedMock} />);
        expect(await findByText('1. Onboarding Satellites')).toBeInTheDocument();
    });

    // Not passed need to manual test
    it('verifies AWS accounts and updates state accordingly', async () => {

        // Mock the getData method to simulate successful verification
        (ServerApi.prototype.getData as jest.Mock)
            .mockResolvedValueOnce({ status: 200, data: { success: true } })
            .mockResolvedValueOnce({ status: 200, data: { success: true } })
            .mockResolvedValueOnce({ status: 200, data: { success: true } })
            .mockResolvedValueOnce({ status: 200, data: { success: true } });

        render(<AwsAccountVerify onCompleted={() => {}} />);

        // Wait for the loading screen to disappear
        await waitFor(() => {
            expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
        });

        // Assert that verification results are displayed
        expect(screen.getByText('1. Onboarding Satellites')).toBeInTheDocument();
        expect(screen.getByText('2. Create a VPC (Virtual Private Network)')).toBeInTheDocument();
        expect(screen.getByText('3. Create a EC2 instance (Elastic Compute Cloud)')).toBeInTheDocument();
        expect(screen.getByText('4. Create a CloudFormation')).toBeInTheDocument();
    });
});

describe('AzureRegisterForm Component', () => {
    it('renders form correctly', () => {
        const { getByText } = render(<AzureRegisterForm />);
        
        expect(getByText('Application ID:')).toBeInTheDocument();
        expect(getByText('Secret Key:')).toBeInTheDocument();
        expect(getByText('Tenant Name:')).toBeInTheDocument();
        expect(getByText('Tenant Id:')).toBeInTheDocument();
        expect(getByText('Submit')).toBeInTheDocument();
    });

    // Not passed
    it('submits form with valid data', async () => {
        const { getByText, getByLabelText } = render(<AzureRegisterForm />);

        // Mock API response
        const mockedAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;
        mockedAxiosPost.mockResolvedValueOnce({ status: 201, data: { success: true } });

        fireEvent.change(getByLabelText('Add application Id'), { target: { value: 'testId' } });
        fireEvent.change(getByLabelText('Add application key'), { target: { value: 'testKey' } });
        fireEvent.change(getByLabelText('Add Tenant name'), { target: { value: 'testTenantName' } });
        fireEvent.change(getByLabelText('Add Tenant Id'), { target: { value: 'testTenantId' } });

        fireEvent.click(getByText('Submit'));

        // Wait for form submission to complete
        await waitFor(() => {
            // Assert that axios.post was called with the correct data
            expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
        });

        expect(document.querySelector('.loading-screen')).not.toBeInTheDocument();
    });
});

describe('AzureResource Component', () => {

    it('renders correctly', () => {
        const onCompletedMock = jest.fn();
        const { getByText } =  render(<AzureResources onCompleted={onCompletedMock} />);
        expect(getByText('1. Register Spacecraft')).toBeInTheDocument();
    });

    it('clicking on Done button updates state and disables the button', () => {
        const onCompletedMock = jest.fn();
        const { getByTestId } = render(<AzureResources onCompleted={onCompletedMock} />);
        const doneButton = getByTestId('btn-done-vm');

        expect(doneButton).not.toBeDisabled();
        fireEvent.click(doneButton);
        expect(doneButton).toBeDisabled();
    });
});

describe('AzureAccountVerify Component', () => {
    it('renders correctly', async () => {
        const { getByText } = render(<AzureAccountVerify onCompleted={() => {}} />);
        expect(getByText('1. Register Spacecraft')).toBeInTheDocument();
        expect(getByText('2. Create a Virtual Network (VNET)')).toBeInTheDocument();
        expect(getByText('3. Create a Virtual Machine (VM)')).toBeInTheDocument();
    });

    // Not pass
    it('verifies Azure accounts and updates state accordingly', async () => {
        const mockGetAzureSpacecrafts = jest.fn().mockResolvedValue({ status: 200, data: { success: true } });
        const mockGetAzureVnet = jest.fn().mockResolvedValue({ status: 200, data: { success: true } });
        const mockGetAzureVm = jest.fn().mockResolvedValue({ status: 200, data: { success: true } });

        jest.mock('src/utills/serverApi', () => {
            return jest.fn().mockImplementation(() => {
                return {
                    getAzureSpacecrafts: mockGetAzureSpacecrafts,
                    getAzureVnet: mockGetAzureVnet,
                    getAzureVm: mockGetAzureVm
                };
            });
        });

        const { getByText } = render(<AzureAccountVerify onCompleted={() => {}} />);

        await waitFor(() => {
            expect(mockGetAzureSpacecrafts).toHaveBeenCalled();
            expect(mockGetAzureVnet).toHaveBeenCalled();
            expect(mockGetAzureVm).toHaveBeenCalled();
        });

        expect(getByText('1. Register Spacecraft').nextElementSibling).toContainHTML('<svg class="MuiSvgIcon-root ...');
        expect(getByText('2. Create a Virtual Network (VNET)').nextElementSibling).toContainHTML('<svg class="MuiSvgIcon-root ...');
        expect(getByText('3. Create a Virtual Machine (VM)').nextElementSibling).toContainHTML('<svg class="MuiSvgIcon-root ...');
    });
});
