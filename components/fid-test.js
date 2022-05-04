import { useState } from "react";


// Silly example that adds a very expensive script to the page on 40% of page loads
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