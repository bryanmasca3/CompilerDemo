import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import React, { useState,useEffect } from 'react';

function App() {

  const numArray = 1;
  const [list, updateList] = useState(numArray);
  const [respo, updateResponse] = useState("");
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
   const handleSubmit = async (e) => {
     e.preventDefault();

     const dataCode = { data: valueCode };
     const res= await axios.post('/py/eval', dataCode);
     updateResponse(res.data.message);
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
          <Col xs={2}><div className="text-name-title">Python Online Compiler</div></Col>
          <Col xs={{ span: 1, offset: 9 }}><Button variant="dark">Theme</Button>{' '}</Col>
      </Row>
      <Row className="main-content">
          <Col className="filecontent">
           <form onSubmit={handleSubmit}>
                <Row className="title-section">
                    <Col xs={2}><div className="text-name"> main.py</div></Col>
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
              <Row className="title-section">
                <Col xs={2} ><div className="text-name">shell </div></Col>
                <Col xs={{ span: 1, offset: 9 }}><Button variant="outline-info">Clear</Button>{' '}</Col>
              </Row>
             <Col xs={12} >
                    {respo}
              </Col>
          </Col>
      </Row>
  </Container>
  );
}

export default App;
