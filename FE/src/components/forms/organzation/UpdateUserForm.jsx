import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import axios from 'axios';
import { BACKENDURL } from '../../../helper/Urls';

const UpdateUserForm = ({ id, reload, openModalFun }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
console.log(id)
  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`${BACKENDURL}/organzation/branch/getById/${id}`)
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

  const handleSubmit = (values) => {
    setLoading(true);
    axios.put(`${BACKENDURL}/organzation/branch/edit`, { ...values, id })
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

  return (
    <>
  
      {initialValues ? (
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={initialValues} 
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the branch name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Employees"
            name="employees"
            rules={[{ required: true, message: 'Please input the number of employees!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input the city!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Sub City / Zone"
            name="subCity"
            rules={[{ required: true, message: 'Please input the sub city/zone!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Wereda"
            name="wereda"
            rules={[{ required: true, message: 'Please input the wereda!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Branch
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Loading...</p>
      )}
      </>
  );
};

export default UpdateUserForm;
