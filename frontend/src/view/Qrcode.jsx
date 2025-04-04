

import React, { useState } from 'react';
import QRCode from 'qrcode';
import axios from 'axios';

const {
  BakongKHQR,
  khqrData,
  IndividualInfo,
  MerchantInfo,
} = require("bakong-khqr");

const BakongPage = () => {
  const [qrimg, setQrimg] = useState(null);

  const handleCheckOut = async (event) => {
    event.preventDefault();

    // Get current timestamp and add a duration (e.g., 15 minutes)
    const expirationTimestamp = new Date().getTime() + 15 * 60 * 1000; // 15 minutes from now

    const optionalData = {
      currency: khqrData.currency.usd,
      amount: 0.01,
      billNumber: "#0001",
      mobileNumber: "85587344479",
      storeLabel: "Chamrouen PichSamphors",
      terminalLabel: "Phors I",
      expirationTimestamp: expirationTimestamp,  // Add expiration timestamp here
    };

    const individualInfo = new IndividualInfo(
      "pichsamphors_chamroeun@aclb",
      "Chamrouen PichSamphors",
      "Battambang",
      optionalData
    );

    const KHQR = new BakongKHQR();
    let individual = null; // Initialize variable outside try-catch

    try {
      individual = KHQR.generateIndividual(individualInfo);
      console.log("Generated Individual:", individual); // Log to inspect
    } catch (error) {
      console.error("Error generating QR:", error);
    }

    if (individual && individual.data) {
      console.log("Individual Data:", individual.data);

      if (individual.data.qr) {
        const qrData = await QRCode.toDataURL(individual.data.qr);
        setQrimg(qrData);
      } else {
        console.error("QR data is missing or invalid:", individual.data.qr);
      }

      if (individual.data.md5) {
        handleCheckTransaction(individual.data.md5);
        console.log("MD5:", individual.data.md5);
      } else {
        console.error("MD5 not available.");
      }
    } else {
      console.error("Invalid individual data:", individual);
    }
  };




  const handleCheckTransaction = async (md5) => {
    try {
      const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMmJjNzYzZDNlNmRmNDRiNyJ9LCJpYXQiOjE3MzU2MzI4NzksImV4cCI6MTc0MzQwODg3OX0.LvLaqsv-LvocVosQaXKOCzZQLIvOL4g4S4nN3kJB5fU"; // this token is renew in bakong open api document
      const response = await axios.post(
        'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5',
        { md5 },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 && response.data.responseMessage === 'Success') {
        console.log("Transaction successful", response.data);
        return true;
      } else {
        console.log('transaction bakong', response)
      }
    } catch (error) {
      console.error("Transaction check failed", error.response?.data || error.message);
    }
    return false; // Return false to indicate the transaction was not successful
  };


  return (
    <div>
      <h1>Welcome to the Bakong Page</h1>
      <p>This is a sample page for the Bakong section of the app.</p>
      <button className='bg-red-500 p-3 text-white rounded-md' onClick={handleCheckOut}>Check Out</button>
      <div>
        <img src={qrimg} alt="QR Code" />
      </div>
    </div>
  );
};

export default BakongPage;