import React from 'react';
import Salt from './Salt';

function Allsalt(props) {
  return (
    <div>
      {props.data.length > 0 ? (
        props.data.map((item, index) => (
          <div key={index}>
            <Salt item={item} />
          </div>
        ))
      ) : (
        <div>Please search for another medicine</div>
      )}
    </div>
  );
}

export default Allsalt;
