import { List, Datagrid, TextField} from 'react-admin';

const RoleList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="roleCode" label="Tên vai trò" />
      <TextField source="roleDescription" label="Mô tả vai trò" />
    </Datagrid>
  </List>
);

export default RoleList;
