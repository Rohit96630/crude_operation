import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/home.css";

function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [age, setAge] = useState("");
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "https://blue-journalist-bbrpv.ineuron.app:4000/users"
      );
      setData(result.data.data);
    };
    fetchData();
  }, []);
  console.log(data);
  // console.log(id);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingIndex === -1) {
      setData([
        ...data,
        {
          phoneNumber: phoneNumber,
          firstName: input1,
          lastName: input2,
          age: age,
        },
      ]);
    } else {
      setData(
        data.map((row, index) =>
          index === editingIndex
            ? {
                phoneNumber: phoneNumber,
                firstName: input1,
                lastName: input2,
                age: age,
              }
            : row
        )
      );
      setEditingIndex(-1);
    }

    const payload = {
      firstName: input1,
      lastName: input2,
      age: age,
      phoneNumber: phoneNumber,
    };
    axios
      .post(
        "https://blue-journalist-bbrpv.ineuron.app:4000/user/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    setPhoneNumber("");
    setInput1("");
    setInput2("");
    setAge("");
  };

  const handleDelete = (index, id) => {
    setData(data.filter((_, i) => i !== index));
    axios
      .delete(`https://blue-journalist-bbrpv.ineuron.app:4000/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (index, id) => {
    const editPayload = {
      firstName: input1,
      lastName: input2,
      phoneNumber: phoneNumber,
      age: age,
    };
    axios
      .patch(`https://blue-journalist-bbrpv.ineuron.app:4000/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        editPayload,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });

    setEditingIndex(index);
    setPhoneNumber(data[index].phoneNumber);
    setInput1(data[index].firstName);
    setInput2(data[index].lastName);
    setAge(data[index].age);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="First_row">
            <input
              required
              type="text"
              value={input1}
              onChange={(event) => setInput1(event.target.value)}
              placeholder="First Name...."
              className="input"
            />
            <input
              required
              type="text"
              value={input2}
              onChange={(event) => setInput2(event.target.value)}
              placeholder="Last Name....."
              className="input"
            />
          </div>
          <div className="Second_row">
            <input
              required
              type="number"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="Age"
              className="input"
            />

            <input
              required
              type="text"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Phone Number..."
              className="input"
            />
          </div>
        </div>

        <div>
          <button type="submit" className="submit-button">
            {editingIndex === -1 ? "Submit" : "Update"}
          </button>
        </div>
      </form>
      <table className="table">
        <thead className="table-header">
          <tr>
            <th>S.No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>phoneNumber</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {editingIndex != index ? (
                <>
                  <td>{index + 1}</td>
                  <td>{row.firstName}</td>
                  <td>{row.lastName}</td>
                  <td>{row.age}</td>
                  <td>{row.phoneNumber}</td>
                </>
              ) : (
                ""
              )}
              <td>
                {editingIndex != index ? (
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                ) : (
                  ""
                )}

                {/* Delete button  */}
                {editingIndex != index ? (
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(index, row._id)}
                  >
                    Delete
                  </button>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
