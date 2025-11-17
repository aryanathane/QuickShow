import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import { dateFormat } from "../../lib/dateFormat";
const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return !isLoading ? (
    <div>
      <Title text1="" List text2="Bookings" />
      <div className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((item) => (
              <tr
                key={item._id}
                className="even:bg-primary/10 border-b border-primary/20"
              >
                <td className="p-2 pl-5">{item.user.name}</td>
                <td className="p-2">{item.show.movie.title}</td>
                <td className="p-2">{dateFormat(item.show.showDateTime)}</td>
                <td className="p-2">
                  {Object.keys(item.bookedSeats)
                    .map((seat) => item.bookedSeats[seat])
                    .join(", ")}
                </td>
                <td className="p-2">
                  {currency} {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ListBookings;
