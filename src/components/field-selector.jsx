import React, { useEffect, useState } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

const FieldSelector = (props) => {
  const { fieldDefs, onChange } = props;

  const [selectedFieldKey, setSelectedFieldKey] = useState('');

  const handleClick = (clickedFieldId) => {
    const nextFieldId = (clickedFieldId === selectedFieldKey) ? '' : clickedFieldId;
    setSelectedFieldKey(nextFieldId);
    if (typeof onChange === 'function') onChange(nextFieldId);
  };

  return (
    <ButtonGroup orientation="vertical" size="small">
      {fieldDefs.map((def) => <Button key={def.fieldId} onClick={() => handleClick(def.fieldId)}>{def.label}</Button>)}
    </ButtonGroup>
  );
};

export default FieldSelector;
