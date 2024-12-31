

import React, { useState,useEffect,useContext } from 'react';
import { Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { BACKENDURL } from '../../../helper/Urls';
import { AlertContext } from '../../../context/AlertContext';
const UpdateDepartmentForm = ({ id, reload, openModalFun }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const { openNotification } = useContext(AlertContext);

  
    const [branchData, setBranchData] = useState([]);
    const [loadingBranch, setLoadingBranch] = useState(false);
    const [departmentData, setDepartmentData] = useState(null);
  
    const getBranchData = async () => {
      setLoadingBranch(true);
      try {
        const res = await axios.get(`${BACKENDURL}/organzation/branch/all`);
        setLoadingBranch(false);
        setBranchData(res.data.branchs);
      } catch (error) {
        openNotification('error', error.response.data.message, 3, 'red');
        setLoadingBranch(false);
      }
    };
    const branchOptions = branchData.length
    ? branchData.map((branch) => ({
        value: branch.id,
        label: branch.name,
      }))
    : [];

    console.log(id)
    const fetchDepartmentData = async () => {
        try {
          const res = await axios.get(`${BACKENDURL}/organzation/department/getById/${id}`);
          setDepartmentData(res.data.department);
          form.setFieldsValue({
            name: res.data.department.name,
            branch: res.data.department.branchId,
          });
        } catch (error) {
          openNotification('error', error.response.data.message, 3, 'red');
        }
      };
    useEffect(() => {
        getBranchData();
        fetchDepartmentData();
        if (id) {
            setLoading(true);
            axios.get(`${BACKENDURL}/organzation/department/getById/${id}`)
                .then((response) => {
                    setInitialValues(response.data);
                    console.log(response.data)
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching branch data:', error);
                    setLoading(false);
                });
        }
    }, [id]);


    const onFinish = async (values) => {
      setLoading(true);
      try {
        const res = await axios.put(`${BACKENDURL}/organzation/department/edit`, {
          ...values,
          id,
        });
        reload();
        setLoading(false);
        openModalFun(false);
        openNotification('success', res.data.message, 3, 'green');
      } catch (error) {
        setLoading(false);
        console.error('Error updating department data:', error);
        openNotification(
          'error',
          error.response?.data?.message || 'An error occurred',
          3,
          'red'
        );
      }
    };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    const handleSubmit = (values) => {
        setLoading(true);
        console.log(values)
        axios.put(`${BACKENDURL}/organzation/department/edit`, { ...values, id })
            .then((response) => {
                setLoading(false);
                reload();
                openModalFun(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error updating branch data:', error);
            });
    };
return(
    <Form
    layout="vertical"
    onFinish={onFinish}
    form={form}
    onFinishFailed={onFinishFailed}
  >
    <Form.Item
      style={{ margin: '5px', width: '100%' }}
      label="Office"
      name="branch"
      rules={[
        {
          required: true,
          message: 'Please select an Office',
        },
      ]}
    >
      <Select
        placeholder="Search to Select"
        options={branchOptions}
        loading={loadingBranch}
        disabled={loadingBranch}
      />
    </Form.Item>

    <Form.Item
      style={{ margin: '5px' }}
      label="Department Name"
      rules={[
        {
          required: true,
          message: 'Please input Name',
        },
      ]}
      name="name"
    >
      <Input />
    </Form.Item>

    <Form.Item
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '15px',
      }}
    >
      <Button
        type="primary"
        htmlType="submit"
        disabled={loading}
        loading={loading}
      >
        Update
      </Button>
    </Form.Item>
  </Form>
);
};

export default UpdateDepartmentForm;
