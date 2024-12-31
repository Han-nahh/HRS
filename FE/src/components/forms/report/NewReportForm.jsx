import React, { useState } from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BACKENDURL } from '../../../helper/Urls';

const { TextArea } = Input;
const { Option } = Select;

const NewReportForm = ({ reload, openModalFun }) => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]); 

    const handleFinish = async (values) => {
        setLoading(true);

        try {
            await axios.post(`${BACKENDURL}/reports/reports`, {
                userId: values.userId,
                date: values.date.format('YYYY-MM-DD'), 
                shiftTime: `${values.shift[0].format('HH:mm')} - ${values.shift[1].format('HH:mm')}`,
                location: values.location,
                report: values.report,
                description: values.description,
                reportMeasurement: values.reportMeasurement,
                status: 'Pending',
                attachments: fileList.map(file => file.name), 
            });

            message.success('Report submitted successfully!');
            reload(); 
            openModalFun(false); 
        } catch (error) {
            message.error('Failed to submit the report.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onFinish={handleFinish} layout="vertical">
            <Form.Item
                name="userId"
                label="User ID"
                rules={[{ required: true, message: 'Please input User ID!' }]}
            >
                <Input placeholder="Enter your User ID" />
            </Form.Item>

            <Form.Item
                name="date"
                label="Date of Report"
                rules={[{ required: true, message: 'Please select a date!' }]}
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
                name="shift"
                label="Shift Time"
                rules={[{ required: true, message: 'Please select a shift time!' }]}
            >
                <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>

            <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please input the location!' }]}
            >
                <Input placeholder="Enter location" />
            </Form.Item>

            <Form.Item
                name="report"
                label="Report Details"
                rules={[{ required: true, message: 'Please input the report details!' }]}
            >
                <TextArea placeholder="Describe the report details" rows={4} />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please provide a description!' }]}
            >
                <TextArea placeholder="Enter a description of the report" rows={4} />
            </Form.Item>

            <Form.Item
                name="reportMeasurement"
                label="Report Magnitude"
                rules={[{ required: true, message: 'Please select a report magnitude!' }]}
            >
                <Select placeholder="Select report magnitude">
                    <Option value="HIGH">High</Option>
                    <Option value="MID">Medium</Option>
                    <Option value="LOW">Low</Option>
                </Select>
            </Form.Item>

            <Form.Item label="Attachments">
                <Upload
                    beforeUpload={(file) => {
                        setFileList((current) => [...current, file]); 
                        return false; 
                    }}
                    onRemove={(file) => {
                        setFileList((current) => current.filter(item => item.uid !== file.uid));
                    }}
                    fileList={fileList} 
                >
                    <Button icon={<UploadOutlined />}>Upload Files</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Submit Report
                </Button>
            </Form.Item>
        </Form>
    );
};

export default NewReportForm;
