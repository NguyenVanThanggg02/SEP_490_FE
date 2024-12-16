import React from "react"
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Constants } from "../utils/constants";

const AddFundsResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const params = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        console.log(params)
        // const params = {
        //     partnerCode: searchParams.get('partnerCode'),
        //     orderId: searchParams.get('orderId'),
        //     requestId: searchParams.get('requestId'),
        //     amount: searchParams.get('amount'),
        //     orderInfo: searchParams.get('orderInfo'),
        //     orderType: searchParams.get('orderType'),
        //     transId: searchParams.get('transId'),
        //     resultCode: searchParams.get('resultCode'),
        //     message: searchParams.get('message'),
        //     payType: searchParams.get('payType'),
        //     responseTime: searchParams.get('responseTime'),
        //     extraData: searchParams.get('extraData'),
        //     signature: searchParams.get('signature'),
        // };
        axios.post(`${Constants.apiHost}/transaction/confirm`, params)
            .then(() => {
                navigate("/addfund")
                window.close();
            })
            .catch(() => {
                navigate("/")
            });
    }, [location.search]);

    return <Box><CircularProgress /> </Box>;
};

export default AddFundsResult;