import { Edit, SimpleForm, TextInput } from 'react-admin';

const RoleEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="roleCode" label="Tên vai trò" />
    </SimpleForm>
  </Edit>
);

export default RoleEdit;
