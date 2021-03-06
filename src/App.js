import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import React, { useState,useEffect } from 'react';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {runCompiler} from "./compiler";

function App() {

  const numArray = 1;
  const [list, updateList] = useState(numArray);
  const [respo, updateResponse] = useState({});
  const [valueCode, setvalueCode] = useState("");

  const calcHeight=(value)=>{
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    let newHeight = 20 + numberOfLineBreaks * 20 + (4*(numberOfLineBreaks+1));
    return newHeight;
   }

   const updateElement = (value) => {
       const temp = (value.match(/\n/g) || []).length;
       updateList(temp+1);
   }
   /*const handleSubmit = async (e) => {
     e.preventDefault();
     
     const dataCode = { data: valueCode };
     console.log(dataCode)
     //const res= await axios.post('/py/eval', dataCode);
     updateResponse(dataCode);

    };*/
    const handleSubmit = async (e) => {
     e.preventDefault();    
     const res = runCompiler(valueCode);
     updateResponse(res);

    };
  
   useEffect(() => {
      const textarea = document.querySelector(".TextCode");

       textarea.addEventListener("keyup", (e) => {
             textarea.style.height = calcHeight(textarea.value) + "px";
             updateElement(textarea.value);
       });

  });

  return (
    <Container fluid>
      <Row className="header">
          <Col xs={2}><div className="text-name-title">Compiler</div></Col>
          <Col xs={{ span: 1, offset: 9 }}><Button variant="dark">Theme</Button>{' '}</Col>
      </Row>
      <Row className="main-content">
          <Col className="filecontent">
           <form onSubmit={handleSubmit}>
                <Row className="title-section">
                    <Col xs={2}><div className="text-name"> file.tyw</div></Col>
                    <Col xs={{ span: 1, offset: 9 }}>  <Button variant="primary" type="submit" >Run</Button>{' '}</Col>
                </Row>
                <Row>
                  <Col xs={1} className="sectionNumeration">
                      {
                        Array.from(Array(list).keys()).map((i) => (
                          <div className="sectionNum" key={i+1}>
                               {i+1}
                          </div>
                        ))
                      }
                  </Col>
                  <Col xs={11}>

                    <textarea name="textarea"
                              className="TextCode"
                              value={valueCode}
                              onChange={e => setvalueCode(e.target.value)}></textarea>
                  </Col>
                </Row>
            </form>
          </Col>
          <Col className="shellcontent">
              {/*<Row className="title-section">
                <Col xs={2} ><div className="text-name">shell </div></Col>
                <Col xs={{ span: 1, offset: 9 }}><Button variant="outline-info" onClick={downloadFile}>Clear</Button>{' '}</Col>
              </Row>*/}  
              <Row className="title-section">
              <Col xs={12} >  
                    <Tabs defaultActiveKey="Tokens" id="uncontrolled-tab-example" className="mb-3">
                      <Tab eventKey="Tokens" title="Tokens">
                      
                      <table className="table">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Lexema</th>
                                  <th scope="col">Type</th>                              
                                </tr>
                              </thead>
                              <tbody>
                                {respo.token?.map((item,index)=>(
                                <tr key={index}>
                                  <th scope="row">{index}</th>
                                  <td>{item._lexema}</td>
                                  <td>{item._type}</td>                            
                                </tr>   
                                  ))}

                                    </tbody>
                            </table>                      
                      </Tab>
                      <Tab eventKey="Tabla" title="Tabla">
                        
                      <table className="table">
                            <thead>
                               
                              </thead>                            
                              <tbody>
                                {respo.success?(
                                respo.table?.map((item,index)=>(
                                <tr key={index} style={{"textAlign":"center"}}>                                 
                                    {item.map((it)=>( <td>{it}</td>))}                                                                                                                            
                                </tr>   
                                ))):<p>Error</p>}

                                    </tbody>
                            </table>                  
                      </Tab>
                      <Tab eventKey="Seguimiento" title="Seguimiento">              
                      <table className="table">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Stack</th>
                                  <th scope="col">Input</th>
                                  <th scope="col">Rule</th>
                                                               
                                </tr>
                              </thead>
                              <tbody>
                                {respo.success?(respo.algorithm?.map((item,index)=>(
                                <tr key={index}>
                                  <th scope="row">{index}</th>
                                  <td>{item[0]}</td>
                                  <td>{item[1]}</td> 
                                  <td>{item[2]}</td>                                                             
                                </tr>   
                                  ))):<p>Error</p>}

                                    </tbody>
                            </table> 
                      
                      </Tab>
                    </Tabs>                 
                     {/* <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Lexema</th>
                              <th scope="col">Type</th>                              
                            </tr>
                          </thead>
                          <tbody>
                            
                           {respo.map((item,index)=>(
                            <tr key={index}>
                              <th scope="row">{index}</th>
                              <td>{item._lexema}</td>
                              <td>{item._type}</td>                            
                            </tr>   
                               ))}                      
                          </tbody>
                        </table>    */}                
                      
                 
              </Col>
              </Row>
            
          </Col>
      </Row>
  </Container>
  );
}

export default App;
