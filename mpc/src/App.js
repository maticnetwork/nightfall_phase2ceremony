import './App.css';
import axios from "axios"
import { Buffer } from "buffer";

// const deposit = require("./circuits/deposit/deposit_0000.zkey")

function App() {
  const contribute = async () => {
  //   await axios({ 
  //     url: "http://localhost:1234/deposit_0000.zkey", 
  //     method:"GET", 
  //     responseType:" blob"
  //   })
  //   .then((response) => {
  //     console.log(typeof response.data)
  //     // create file link in browser's memory
  //     const href = URL.createObjectURL(response.data);
  // });

  //  await snarkjs.powersOfTau.contribute(new Uint8Array(await (await (await fetch(chrome.extension.getURL("1.ptau"))).blob()).arrayBuffer()), {type:"mem"}, 'aaaa', 'dddd')

    const depositGet = await axios({ 
        url: "http://localhost:1234/deposit_0000.zkey", 
        method:"GET", 
        // responseType: "blob"
      })

    // const depositFile = await depositGet.data.arrayBuffer()

    // const deposit = Buffer.from(depositGet.data)
    // const depositFile = new File([depositGet.data], "depositFile", { type: "bigMem"})

    const o = { data: null, type: "mem"}
    // console.log(depositFile instanceof File)
    console.log(typeof depositGet.data)
    const deposit1 = await window.snarkjs.zKey.contribute(depositGet.data, o, "hdello", "894749832")
    // // console.log(deposit1)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={contribute}>
          Contribute
        </button>
      </header>
    </div>
  );
}

export default App;
