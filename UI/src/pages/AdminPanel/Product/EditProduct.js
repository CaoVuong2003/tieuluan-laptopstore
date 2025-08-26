import {
  ArrayInput,
  BooleanInput,
  Edit,
  ImageField,
  ImageInput,
  NumberInput,
  required,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
} from 'react-admin';
import { colorSelector } from '../../../components/Filters/ColorsFilter';
import CategoryTypeInput from '../Category/CategoryTypeInput';
import CategoryBrandInput from '../Category/CategoryBrandInput';
import SpecificationInput from './SpecificationInput';

const EditProduct = (props) => {

  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="Name" source="name" />
        <TextInput label="Description" source="description" />
        <TextInput label="Price" source="price" type="number" />
        <CategoryTypeInput validate={[required()]} />
        <CategoryBrandInput validate={[required()]} />

        <ArrayInput source="variants" label="Edit Variants">
          <SimpleFormIterator inline>
            <SelectInput
              source="color"
              choices={Object.keys(colorSelector)}
              resettable
              emptyText={false}
            />
            <NumberInput source="stockQuantity" />
          </SimpleFormIterator>
        </ArrayInput>

        <ArrayInput source="productResources">
          <SimpleFormIterator inline>
            <TextInput source="name" />
            <ImageInput source="url" label="Product Image" accept="image/*">
              <ImageField source="src" title="title" />
            </ImageInput>
            <SelectInput
              source="type"
              choices={[{ id: 'image', name: 'image' }]}
              emptyText={false}
            />
            <BooleanInput source="isPrimary" label="Set as Primary" />
          </SimpleFormIterator>
        </ArrayInput>
        <SpecificationInput />
        <BooleanInput
          source="enabled"
          label="Kích hoạt"
          format={(v) => v === 'true' || v === true || v === 1}
        />

      </SimpleForm>
    </Edit>
  );
};

export default EditProduct;