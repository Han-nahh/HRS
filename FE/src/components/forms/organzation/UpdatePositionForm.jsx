import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { AlertContext } from '../../../context/AlertContext';
import { BACKENDURL } from '../../../helper/Urls';

const UpdatePositionForm = ({ id, reload, openModalFun }) => {
    const { openNotification } = useContext(AlertContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [branchData, setBranchData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [loadingBranch, setLoadingBranch] = useState(false);
    const [loadingDepartment, setLoadingDepartment] = useState(false);

    useEffect(() => {
        const getBranchData = async () => {
            setLoadingBranch (true);
            try {
              const res = await axios.get (`${BACKENDURL}/organzation/branch/all`);
              setLoadingBranch (false);
              setBranchData (res.data.branchs);
            } catch (error) {
              openNotification ('error', error.response.data.message, 3, 'red');
              setLoadingBranch (false);
            }
          }
        const fetchPositionDetails = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${BACKENDURL}/organzation/position/getbyid/${id}`);
                const position = res.data;
                console.log(res.data)
                form.setFieldsValue({
                    name: position.name,
                    branch: position.branch,
                    department: position.department,
                });
                setDepartmentData(position.availableDepartments||[]);
                setLoading(false);
            } catch (error) {
                openNotification('error', error.response?.data?.message || 'Failed to fetch position details', 3, 'red');
                setLoading(false);
            }
        };
        getBranchData();
        fetchPositionDetails();
    }, [id]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await axios.put(`${BACKENDURL}/organzation/position/edit`, {
                ...values,
                id
            }); reload();
            openModalFun(false);
            openNotification('success', res.data.message, 3, 'green');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            openNotification('error', error.response?.data?.message || 'Update failed', 3, 'red');
        }
    };

    const handleBranchChange = async (branchId) => {
        setLoadingDepartment(true);
        try {
            const res = await axios.get(`${BACKENDURL}/organzation/department/find?branchId=${branchId}`);
            setDepartmentData(res.data.departments);
            form.resetFields(['department']);
            setLoadingDepartment(false);
        } catch (error) {
            openNotification('error', error.response?.data?.message || 'Failed to fetch departments', 3, 'red');
            setLoadingDepartment(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ branch: '', department: '', name: '' }}
        >
            <Form.Item
                label="Office"
                name="branch"
                rules={[{ required: true, message: 'Please select an office' }]}
            >
                <Select
                    placeholder="Select an office"
                    options={branchData.map(branch => ({ value: branch.id, label: branch.name }))}
                    loading={loadingBranch}
                    onChange={handleBranchChange}
                />
            </Form.Item>
            <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true, message: 'Please select a department' }]}
            >
                <Select
                    placeholder="Select a department"
                    options={departmentData.map(department => ({ value: department.id, label: department.name }))}
                    loading={loadingDepartment}
                    disabled={!departmentData.length}
                />
            </Form.Item>
            <Form.Item
                label="Position Name"
                name="name"
                rules={[{ required: true, message: 'Please enter the position name' }]}
            >
                <Input placeholder="Enter position name" />
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Update Position
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdatePositionForm;
