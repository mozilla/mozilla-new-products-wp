import metadata from './block.json';

export default {
  name: metadata.name,
  title: metadata.title,
  edit: () => <p>This is the edit version of the static native block - EDIT</p>,
  save: () => <p>This is the save version of the static native block - SAVE</p>,
};
