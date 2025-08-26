import { Create, SimpleForm, TextInput, required } from 'react-admin';

const RoleCreate = () => (
  <Create title="Tạo vai trò mới">
    <SimpleForm>
      <TextInput source="roleCode" label="Mã vai trò" validate={required()} fullWidth />
      <TextInput source="roleDescription" label="Mô tả vai trò" validate={required()} fullWidth />
    </SimpleForm>
  </Create>
);

export default RoleCreate;
