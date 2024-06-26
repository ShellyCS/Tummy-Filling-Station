import React, { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress } from "@mui/material";
import { mainRoute } from "../../api";
import { useSelector } from "react-redux";
import { IMG_CDN_URL } from "../body/config";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(mainRoute + "/orders/myOrders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        });
        const data = await response.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrders();
  }, [token]);

  const backfunc = () => {
    navigate(-1);
  };

  // Sort orders by orderDate in descending order to show latest orders first
  const sortedOrders = orders
    .slice()
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  return (
    <>
      <button
        className="text-white bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600"
        onClick={backfunc}
        style={{ position: "absolute", left: "100px", margin: "20px" }}
      >
        Back
      </button>
      <Grid
        container
        spacing={5}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={11} style={{ marginTop: "30px" }}>
          <Typography
            variant="h5"
            color={"primary"}
            fontWeight={"bold"}
            style={{ textAlign: "center", color: "#FFA500" }}
          >
            My Orders
          </Typography>
        </Grid>
        <Grid item xs={10}>
          {loading ? ( // Show loading spinner while fetching orders
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : sortedOrders.length === 0 ? (
            <Typography
              variant="h1"
              color="textSecondary"
              style={{ textAlign: "center", fontSize: "2rem" }}
            >
              There are no orders yet!
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {sortedOrders.map((order) => (
                <Grid item xs={12} key={order.orderId}>
                  <Grid
                    container
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Grid item xs={12}>
                      <Grid container alignItems={"center"} spacing={1}>
                        <Grid item>
                          <Typography
                            variant="h6"
                            gutterBottom
                            color={"primary"}
                          >
                            Order ID: {order.orderId}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography gutterBottom>
                            ({new Date(order.orderDate).toLocaleString()})
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={11}>
                      <Grid container spacing={1}>
                        {order.details.map((detail) => (
                          <Grid item xs={12} key={detail.id}>
                            <Grid container spacing={2}>
                              <Grid item>
                                {detail?.base64Image ? (
                                  <img
                                    className="w-32 h-32 object-cover"
                                    alt="Product image"
                                    src={`data:image/jpeg;base64,${detail?.base64Image}`}
                                  />
                                ) : (
                                  <img
                                    src={IMG_CDN_URL + detail.imageId}
                                    alt="Product image"
                                    className="w-32 h-32 object-cover"
                                  />
                                )}
                              </Grid>
                              <Grid item>
                                <Typography
                                  variant="body1"
                                  gutterBottom
                                  color={"secondary"}
                                >
                                  {detail.name}
                                </Typography>
                                <Typography variant="body2">
                                  {detail.description}
                                </Typography>
                                <Typography variant="body2">
                                  {" "}
                                  Quantity: {detail.count}
                                </Typography>
                                <Typography variant="body2" color={"primary"}>
                                  Price: ${detail.price / 100}
                                </Typography>
                                <Typography variant="body2" color={"primary"}>
                                  Total Price: $
                                  {(detail.price / 100) * detail.count}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default MyOrders;
