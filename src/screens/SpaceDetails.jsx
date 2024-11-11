import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Drawer,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FlagFill, PlusCircle } from "react-bootstrap-icons";

import SpaceImages from "./SpaceImages";
import FavoriteButton from "./FavoriteButton";
import SpaceInfo from "./SpaceInfo";
import BookingOptions from "./BookingOptions";
import Reports from "./Reports";
import SelectSpaceToCompare from "./SelectSpaceToCompare";
import Similar from "./Similar";

function SpaceDetails() {
  const { id } = useParams();
  const [spaceData, setSpaceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [visibleReport, setVisibleReport] = useState(false);
  const [valueFromChild, setValueFromChild] = useState('');
  const [compare, setCompare] = useState({});
  const navigate = useNavigate();

  const fetchSpaceData = async (spaceId) => {
    try {
      const response = await axios.get(`http://localhost:9999/spaces/${spaceId}`);
      return response.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaceData(id).then(setSpaceData);
  }, [id]);

  useEffect(() => {
    if (valueFromChild) {
      fetchSpaceData(valueFromChild).then(setCompare);
    }
  }, [valueFromChild]);

  const handleCompare = () => {
    if (valueFromChild) {
      navigate('/compare', { state: { id, valueFromChild } });
    }
  };

  const drawerContent = useCallback(
    () => (
      <DrawerContent
        spaceData={spaceData}
        compareData={compare}
        handleCompare={handleCompare}
        setValueFromChild={setValueFromChild}
      />
    ),
    [spaceData, compare, handleCompare]
  );

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="error">Error loading data.</Typography>;

  return (
    <Container fluid spacing={3} style={{ padding: "20px" }}>
      <SpaceInfo spaceData={spaceData} onToggleDrawer={() => setOpenDrawer(true)} />

      <Drawer anchor="bottom" open={openDrawer} onClose={() => setOpenDrawer(false)} sx={{
          '& .MuiDrawer-paper': {
            width: '50vw',  
            left: '25vw',   
            right: 'auto',
          }
        }}>
        {drawerContent()}
      </Drawer>

      <BookingOptions spaceData={spaceData} />

      {visibleReport && <Reports visible={visibleReport} setVisible={setVisibleReport} />}
      <Similar spaceData={spaceData} />
    </Container>
  );
}

export default SpaceDetails;
