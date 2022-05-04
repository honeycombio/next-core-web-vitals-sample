import { useState } from "react";

export default function FID() {
  const [addScript] = useState((Math.random() <= .4));

  if (addScript) {  
    return (
      <div dangerouslySetInnerHTML={{__html:`<script type="text/javascript" src="/fid-example.js"></script>`}} />
    )
  }

  return (
    <div />
  )
  
}