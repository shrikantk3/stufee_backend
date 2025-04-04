const express = require('express');
const app = express();
const studentRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');
const verifyToken = require('../controller/jwtauth');
const mailer = require('../controller/mailer');

studentRouter.get('/', verifyToken, (req, res) => {
    connection.query('select * from student_log', (err, row, feild) => {
        if (err) { res.send(resultAPI(err, row, feild, 'Error on Load!')) } else {
          res.send(resultAPI(err, row, feild, 'Student Data Load successfully!'));
        }
    })
}).get('/:id', verifyToken, (req, res) => {
  let strqry = `select std.*, cl.name as class, sc.name as section from student_log std INNER JOIN class_log  cl on cl.id =std.class_id INNER JOIN section_log sc on sc.id = std.section_id where std.uid = '${req.params.id}'`
  connection.query(strqry, (err, row, feild) => {
      if (err) { res.send(resultAPI(err, row, feild, 'Error on Load!')) } else {
        res.send(resultAPI(err, row, feild, 'Student Data Load successfully!'));
      }
    })
}).get('/byschool/:id', verifyToken, (req, res) => {
    connection.query(`select std.*, cl.name as class, sc.name as section from student_log std INNER JOIN class_log  cl on cl.id =std.class_id  INNER JOIN section_log sc on sc.id = std.section_id where std.school_id = '${req.params.id}'`, (err, row, feild) => {
      if (err) { res.send(resultAPI(err, row, feild, 'Error on Load!')) } else {
        res.send(resultAPI(err, row, feild, 'Student Data Load successfully!'));
      }
    })
})
.get('/byschool/:id/:finyear', verifyToken, (req, res) => {
  connection.query(`select std.*, cl.name as class, sc.name as section from student_log std INNER JOIN class_log  cl on cl.id =std.class_id INNER JOIN section_log sc on sc.id = std.section_id where std.school_id = '${req.params.id}' and std.fin_year='${req.params.finyear}'`, (err, row, feild) => {
    if (err) { res.send(resultAPI(err, row, feild, 'Error on Load!')) } else {
      res.send(resultAPI(err, row, feild, 'Student Data Load successfully!'));
    }
  })
}) .post('/', verifyToken, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.body) {
      let data = req.body;
      let date = new Date();
      data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
      let str = `Insert INTO student_log (id, uid, fname, mname, lname, full_name,mother_name, father_name, city, country, class_id, school_id, section_id, phone, address1, address2, email, parent_id, created_by, created_on, modify_by, modify_on, dob, doa,state, doc1, doc2, certificate, prev_school, active, persona, gender, fin_year) 
      VALUES ('${data.id}', '${data.uid}', '${data.fname}','${data.mname}', '${data.lname}','${data.full_name}', '${data.mother_name}', '${data.father_name}', '${data.city}',
       '${data.country}', '${data.class_id}','${data.school_id}','${data.section_id}','${data.phone}','${data.address1}','${data.address2}','${data.email}','${data.parent_id}','admin',sysdate(),'admin',sysdate(), '${data.dob}', '${data.doa}', '${data.state}','${data.doc1}','${data.doc2}','${data.certificate}','${data.prev_school}',1,1, '${data.gender}', '${data.fin_year}')`;
          
      connection.query(str, (err, rows, feilds) => {
          if (err) {
              res.send(resultAPI(err, rows, feilds, 'Data error!'))
          }
          else {
            connection.query(`select * from school_log where id='${data.school_id}'`,(err, row, feild)=>{
              let school;
              school = rows[0];
              mailer('Myschool',`${data.email}`,'Student Create Successful','',student_email(data, row[0]))
            })
              
              res.send(resultAPI(err, rows, feilds, 'Data successful!'))
          }
      })
  }
}).post('/byClassSection', verifyToken, (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (req.body) {
            let data = req.body;
            let str = `select * from student_log where school_id='${data.school_id}' and fin_year = '${data.fin_year}'`;
            str += data.class_id?` and class_id='${data.class_id}'`:''; 
            str+=data.section_id?` and section_id='${data.section_id}'`:'';
            connection.query(str, (err, rows, feilds) => {
                if (err) {
                    res.send(resultAPI(err, rows, feilds, 'Data error!'))
                }
                else {                 
                    
                    res.send(resultAPI(err, rows, feilds, 'Data successful!'))
                }
            })
        }
}).put('/', verifyToken, (req, res) => {
        if (req.body) {
            let data = req.body;
            res.setHeader('Access-Control-Allow-Origin', '*');
            let str = `UPDATE student_log SET fname='${data.fname}', mname='${data.mname}', lname='${data.lname}',full_name='${data.fname} ${data.mname} ${data.lname}', dob='${data.dob}',doa='${data.doa}',father_name='${data.father_name}',mother_name='${data.mother_name}',city='${data.city}', country='${data.country}', class_id='${data.class_id}', section_id='${data.section_id}', phone='${data.phone}', address1='${data.address1}', address2='${data.address2}', state='${data.state}', email='${data.email}', parent_id='${data.parent_id}',modify_by='admin', modify_on=sysdate(), profile_pic='${data.profile_pic}', certificate='${data.certificate}', doc1='${data.doc1}', doc2='${data.doc2}', active=${data.active}, gender='${data.gender}', fin_year='${data.fin_year}' WHERE uid ='${data.uid}'`;
            connection.query(str, (err, rows, feilds) => {
                if (err) {
                    res.send(resultAPI(err, rows, feilds, 'Data error!'))
                }
                else {
                    res.send(resultAPI(err, rows, feilds, 'Data successful!'))
                }
            })
        }
    })
    .delete('/', verifyToken, (req, res) => {
        res.send('studentRouter DELETE Reposnse of Router');
    });

    function student_email(schoolData, school){
      return `<!DOCTYPE HTML
      PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
      <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>
    
      <style type="text/css">
        @media only screen and (min-width: 620px) {
          .u-row {
            width: 600px !important;
          }
    
          .u-row .u-col {
            vertical-align: top;
          }
    
    
          .u-row .u-col-100 {
            width: 600px !important;
          }
    
        }
    
        @media only screen and (max-width: 620px) {
          .u-row-container {
            max-width: 100% !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
    
          .u-row {
            width: 100% !important;
          }
    
          .u-row .u-col {
            display: block !important;
            width: 100% !important;
            min-width: 320px !important;
            max-width: 100% !important;
          }
    
          .u-row .u-col>div {
            margin: 0 auto;
          }
    
    
          .u-row .u-col img {
            max-width: 100% !important;
          }
    
        }
    
        body {
          margin: 0;
          padding: 0
        }
    
        table,
        td,
        tr {
          border-collapse: collapse;
          vertical-align: top
        }
    
        p {
          margin: 0
        }
    
        .ie-container table,
        .mso-container table {
          table-layout: fixed
        }
    
        * {
          line-height: inherit
        }
    
        a[x-apple-data-detectors=true] {
          color: inherit !important;
          text-decoration: none !important
        }
    
    
        table,
        td {
          color: #000000;
        }
    
        #u_body a {
          color: #0000ee;
          text-decoration: underline;
        }
    
        @media (max-width: 480px) {
          #u_content_heading_2 .v-font-size {
            font-size: 45px !important;
          }
    
          #u_content_image_1 .v-src-width {
            width: auto !important;
          }
    
          #u_content_image_1 .v-src-max-width {
            max-width: 92% !important;
          }
    
          #u_content_social_1 .v-container-padding-padding {
            padding: 30px 10px 10px !important;
          }
    
          #u_content_text_2 .v-container-padding-padding {
            padding: 10px 10px 20px !important;
          }
    
          #u_content_image_3 .v-container-padding-padding {
            padding: 20px 10px 30px !important;
          }
        }
      </style>
    
    
    
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css">
      <!--<![endif]-->
    
    </head>
    
    <body class="clean-body u_body"
      style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #e7e7e7;color: #000000">
      <!--[if IE]><div class="ie-container"><![endif]-->
      <!--[if mso]><div class="mso-container"><![endif]-->
      <table id="u_body"
        style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #e7e7e7;width:100%"
        cellpadding="0" cellspacing="0">
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #e7e7e7;"><![endif]-->
    
    
    
              <!--[if gte mso 9]>
          <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;min-width: 320px;max-width: 600px;">
            <tr>
              <td background="https://cdn.templates.unlayer.com/assets/1697613131983-Layer%20bg.png" valign="top" width="100%">
          <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width: 600px;">
            <v:fill type="frame" src="https://cdn.templates.unlayer.com/assets/1697613131983-Layer%20bg.png" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
          <![endif]-->
    
              <div class="u-row-container"
                style="padding: 0px;background-image: url('https://cdn.templates.unlayer.com/assets/1697613131983-Layer%20bg.png');background-repeat: no-repeat;background-position: center top;background-color: #fdeed2">
                <div class="u-row"
                  style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                  <div
                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-image: url('https://cdn.templates.unlayer.com/assets/1697613131983-Layer%20bg.png');background-repeat: no-repeat;background-position: center top;background-color: #fdeed2;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
    
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                    <div class="u-col u-col-100"
                      style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div style="height: 100%;width: 100% !important;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                          style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                          <!--<![endif]-->
    
                          <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0"
                            cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding"
                                  style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:arial,helvetica,sans-serif;"
                                  align="left">
    
                                  <!--[if mso]><table width="100%"><tr><td><![endif]-->
                                  <h1 class="v-font-size"
                                    style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 25px; font-weight: 700;">
                                    <span>Welcome to</span></h1>
                                  <!--[if mso]></td></tr></table><![endif]-->
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table id="u_content_heading_2" style="font-family:arial,helvetica,sans-serif;"
                            role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding"
                                  style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 10px;font-family:arial,helvetica,sans-serif;"
                                  align="left">
    
                                  <!--[if mso]><table width="100%"><tr><td><![endif]-->
                                  <h1 class="v-font-size"
                                    style="margin: 0px; line-height: 110%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 30px; font-weight: 700;">
                                    <span style="color: orangered;">
                                    <img scr="http://www.my-school.info/${school.logo?school.logo:''}" height='80px'; width="auto" />&nbsp;
                                    ${school.name}-${school.location}<br/></span></h1>
                                    <h5 style="text-align: center;">Your Gateway to a Seamless School Experience!</h5>
                                  <!--[if mso]></td></tr></table><![endif]-->
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table id="u_content_image_1" style="font-family:arial,helvetica,sans-serif;" role="presentation"
                            cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding"
                                  style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;"
                                  align="left">
    
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
                                        <img align="center" border="0"
                                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTQ2V1Wk_r4SOBPbLY3o391Gk6aeFu6UrYvA&s"
                                          alt="image" title="image"
                                          style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 68%;max-width: 394.4px;"
                                          width="394.4" class="v-src-width v-src-max-width" />
    
                                      </td>
                                    </tr>
                                  </table>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div><!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>
    
              <!--[if gte mso 9]>
          </v:textbox></v:rect>
        </td>
        </tr>
        </table>
        <![endif]-->
    
    
    
    
    
              <div class="u-row-container" style="padding: 0px;background-color: #fdeed2">
                <div class="u-row"
                  style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                  <div
                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #fdeed2;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
    
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                    <div class="u-col u-col-100"
                      style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div
                        style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                          style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                          <!--<![endif]-->
    
                          <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0"
                            cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding"
                                  style="overflow-wrap:break-word;word-break:break-word;padding:50px 30px;font-family:arial,helvetica,sans-serif;"
                                  align="left">
    
                                  <div class="v-font-size"
                                    style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                    <p style="line-height: 140%;">Dear Student/Parent,</p>
                                    <p style="line-height: 140%;">Welcome to the ${school.name}  community! <br/> Branch : ${school.location}, Address: ${school.address1},${school.address2}, City:${school.city}.
                                    
                                        <ol>
                                            <li><a href="http://www.my-school.info" target="_blank">http://www.my-school.info</a>&nbsp; Open link in your browser</li>
                                            <li>Select Your School from list</li>
                                            <li>On Login page enter your Credential given below.</li>
                                        </ol>
                                    <br/>Your account has been created and crredential shared benlow:</p>
                                    <p style="line-height: 140%;">
                                        <b>Username :</b>&nbsp;${schoolData.username}<br/>
                                        <b>Password :</b>&nbsp;${schoolData.password}
                                    </p>
                                    <p style="line-height: 140%;"> </p>
                                    <p style="line-height: 140%;">You can login with this credential and use you school dashboard.</p>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div><!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div>    
              <div class="u-row-container" style="padding: 0px;background-color: #fdeed2">
                <div class="u-row"
                  style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                  <div
                    style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #fdeed2;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
    
                    <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                    <div class="u-col u-col-100"
                      style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                      <div
                        style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                        <!--[if (!mso)&(!IE)]><!-->
                        <div
                          style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                          <!--<![endif]-->
    
                          <table id="u_content_text_2" style="font-family:arial,helvetica,sans-serif;" role="presentation"
                            cellpadding="0" cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding"
                                  style="overflow-wrap:break-word;word-break:break-word;padding:10px 100px 30px;font-family:arial,helvetica,sans-serif;"
                                  align="left">
    
                                  <div class="v-font-size"
                                    style="font-size: 14px; line-height: 170%; text-align: center; word-wrap: break-word;">
                                    <p style="font-size: 14px; line-height: 170%;"><b>Website: </b><a href="http://www.my-school.info" target="_blank">http://www.my-school.info</a></p>
                                    <p style="font-size: 14px; line-height: 170%;"><b>Contact: </b>${school.phone}</p>
                                    <p style="font-size: 14px; line-height: 170%;"><b>Email: </b>${school.email}</p>
                                    <small style="font-size: 12px; line-height:12px">MySchool is a powerful platform integrates academic, administrative, and communication tools into a single, centralized system, offering a seamless experience for school administrators, teachers, students, and parents.</small>
                                  </div>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>
    
                          <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0"
                            cellspacing="0" width="100%" border="0">
                            <tbody>
                              <tr>
                                <td class="v-container-padding-padding"
                                  style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:arial,helvetica,sans-serif;"
                                  align="left">
    
                                  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                                    style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                    <tbody>
                                      <tr style="vertical-align: top">
                                        <td
                                          style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                          <span>&#160;</span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
    
                                </td>
                              </tr>
                            </tbody>
                          </table>                    
    
                          <!--[if (!mso)&(!IE)]><!-->
                        </div><!--<![endif]-->
                      </div>
                    </div>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
              </div> 
    
              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!--[if mso]></div><![endif]-->
      <!--[if IE]></div><![endif]-->
    </body>
    
    </html>`
    }
    
    
module.exports = studentRouter;
