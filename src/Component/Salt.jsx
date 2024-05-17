import React, { useState, useEffect } from "react";

function getLowestPrice(saltData, formKey, strengthKey, packingKey) {
  if (
    !saltData ||
    !saltData[formKey] ||
    !saltData[formKey][strengthKey] ||
    !saltData[formKey][strengthKey][packingKey]
  ) {
    return null; // Return null if any required data is missing
  }

  const pharmacies = saltData[formKey][strengthKey][packingKey];
  let lowestPrice = null;

  for (const [pharmacyId, pharmacyData] of Object.entries(pharmacies)) {
    if (pharmacyData && pharmacyData.length > 0) {
      const minPrice = Math.min(
        ...pharmacyData.map((data) => data.selling_price)
      );
      if (lowestPrice === null || minPrice < lowestPrice) {
        lowestPrice = minPrice;
      }
    }
  }

  return lowestPrice;
}

function SaltComponent(props) {
  const availableForms = props.item["available_forms"];
  const initialForms = availableForms.slice(0, 4);
  const [selectedForm, setSelectedForm] = useState(initialForms[0]);
  const [forms, setForms] = useState(initialForms);
  const [selectedStrength, setSelectedStrength] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [displayedStrengths, setDisplayedStrengths] = useState([]);
  const [selectedPacking, setSelectedPacking] = useState("");
  const [packings, setPackings] = useState([]);
  const [lowestPrice, setLowestPrice] = useState(null);

  useEffect(() => {
    setForms(initialForms);
    setSelectedForm(initialForms[0]);
  }, [props.item]);

  useEffect(() => {
    if (
      props.item &&
      props.item["salt_forms_json"] &&
      props.item["salt_forms_json"][selectedForm]
    ) {
      const newStrengths = Object.keys(
        props.item["salt_forms_json"][selectedForm]
      );
      setStrengths(newStrengths);
      setDisplayedStrengths(newStrengths.slice(0, 4));
      if (newStrengths.length > 0) {
        setSelectedStrength(newStrengths[0]);
        const newPackings = Object.keys(
          props.item["salt_forms_json"][selectedForm][newStrengths[0]]
        );
        setPackings(newPackings);
        if (newPackings.length > 0) {
          setSelectedPacking(newPackings[0]);
          const lowestPrice = getLowestPrice(
            props.item["salt_forms_json"],
            selectedForm,
            newStrengths[0],
            newPackings[0]
          );
          setLowestPrice(lowestPrice);
        }
      }
    }
  }, [props.item, selectedForm]);

  const handleShowMoreForms = () => {
    setForms(availableForms);
  };

  const handleShowLessForms = () => {
    setForms(initialForms);
  };

  const handleShowMoreStrengths = () => {
    setDisplayedStrengths(strengths);
  };

  const handleShowLessStrengths = () => {
    setDisplayedStrengths(strengths.slice(0, 4)); // Show only the first four strengths
  };

  const handleFormSelection = (form) => {
    setSelectedForm(form);
    const newStrengths = Object.keys(props.item["salt_forms_json"][form]);
    setStrengths(newStrengths);
    setDisplayedStrengths(newStrengths.slice(0, 4));
    if (newStrengths.length > 0) {
      setSelectedStrength(newStrengths[0]);
      const newPackings = Object.keys(
        props.item["salt_forms_json"][form][newStrengths[0]]
      );
      setPackings(newPackings);
      if (newPackings.length > 0) {
        setSelectedPacking(newPackings[0]);
        const lowestPrice = getLowestPrice(
          props.item["salt_forms_json"],
          form,
          newStrengths[0],
          newPackings[0]
        );
        setLowestPrice(lowestPrice);
      } else {
        setSelectedPacking("");
        setLowestPrice(null);
      }
    } else {
      setSelectedStrength("");
      setPackings([]);
      setSelectedPacking("");
      setLowestPrice(null);
    }
  };

  const handleStrengthSelection = (strength) => {
    setSelectedStrength(strength);
    const newPackings = Object.keys(
      props.item["salt_forms_json"][selectedForm][strength]
    );
    setPackings(newPackings);
    if (newPackings.length > 0) {
      setSelectedPacking(newPackings[0]);
      const lowestPrice = getLowestPrice(
        props.item["salt_forms_json"],
        selectedForm,
        strength,
        newPackings[0]
      );
      setLowestPrice(lowestPrice);
    } else {
      setSelectedPacking("");
      setLowestPrice(null);
    }
  };

  const handlePackingSelection = (packing) => {
    setSelectedPacking(packing);
    const lowestPrice = getLowestPrice(
      props.item["salt_forms_json"],
      selectedForm,
      selectedStrength,
      packing
    );
    setLowestPrice(lowestPrice);
  };

  return (
    <div>
      <div className="flex justify-around align-center content-center border border-black shadow-black shadow-md mb-4 p-4 w-[80vw] m-auto rounded-2xl py-[3vh] shadow-lg shadow-black my-[10vh]">
        <div className="flex flex-col justify-center w-[25%]">
          <div className="flex justify-between">
            <h3 className="mb-4 mr-6">Forms: </h3>
            <div className="grid grid-cols-2 gap-5">
              {forms.map((form, index) => {
                const priceAvailable =
                  getLowestPrice(
                    props.item["salt_forms_json"],
                    form,
                    selectedStrength,
                    selectedPacking
                  ) !== null;
                const isDashed = !priceAvailable;

                return (
                  <button
                    key={index}
                    className={`border overflow-hidden border-gray-400 text-xs pl-3 rounded-lg pr-6 h-8 w-[90px] ${
                      selectedForm === form
                        ? "bg-white text-blue-500 border-blue-500 shadow-lg shadow-green-200"
                        : priceAvailable
                        ? "border-solid text-blue-800 border-2 border-white-100"
                        : "border-dashed text-blue-800 border-2 border-white-100"
                    } ${isDashed ? "dashed-border" : ""}`}
                    onClick={() => handleFormSelection(form)}
                    style={{ marginRight: "8px" }}
                  >
                    {form}
                  </button>
                );
              })}
            </div>
          </div>
          {availableForms.length > 4 && (
            <div className="flex justify-end">
              {forms.length < availableForms.length ? (
                <button
                  onClick={handleShowMoreForms}
                  className="bg-blue-500 text-white rounded-lg px-2 mt-2"
                >
                  More
                </button>
              ) : (
                <button
                  onClick={handleShowLessForms}
                  className="bg-blue-500 text-white rounded-lg px-2 mt-2"
                >
                  Less
                </button>
              )}
            </div>
          )}
          <div className="mb-4 flex justify-between mt-8">
            <div>
              <h3>Strength:</h3>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-5 ml-2">
                {displayedStrengths.map((strength, index) => { // Display all strengths in displayedStrengths
                  const priceAvailable =
                    getLowestPrice(
                      props.item["salt_forms_json"],
                      selectedForm,
                      strength,
                      selectedPacking
                    ) !== null;
                  const isDashed = !priceAvailable;

                  return (
                    <button
                      key={index}
                      className={`border overflow-hidden border-gray-400 text-xs pl-3 rounded-lg pr-6 h-8 w-[90px] ${
                        selectedStrength === strength
                          ? "bg-white text-blue-500 border-black shadow-md shadow-green-200"
                          : priceAvailable
                          ? "border-solid text-green-800 border-2 border-white-100"
                          : "border-dashed text-green-800 border-2 shadow-black border-white-100"
                      } ${isDashed ? "dashed-border" : ""}`}
                      onClick={() => handleStrengthSelection(strength)}
                      style={{ marginRight: "8px" }}
                    >
                      {strength}
                    </button>
                  );
                })}
              </div>
              {strengths.length > 2 && (
                <div className="flex justify-end">
                  {displayedStrengths.length < strengths.length ? (
                    <button
                      onClick={handleShowMoreStrengths}
                      className="bg-blue-500 text-white rounded-lg px-2 mt-2"
                    >
                      More
                    </button>
                  ) : (
                    <button
                      onClick={handleShowLessStrengths}
                      className="bg-blue-500 text-white rounded-lg px-2 mt-2"
                    >
                      Less
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mb-4 flex justify-between mt-8">
            <div>
              <h3>Packing:</h3>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-5 ml-2">
                {packings.slice(0, 2).map((packing, index) => { // Only display first two packings
                  const priceAvailable =
                    getLowestPrice(
                      props.item["salt_forms_json"],
                      selectedForm,
                      selectedStrength,
                      packing
                    ) !== null;
                  const isDashed = !priceAvailable;

                  return (
                    <button
                      key={index}
                      className={`border overflow-hidden border-gray-400 text-xs pl-3 rounded-lg pr-6 h-8 w-[90px] ${
                        selectedPacking === packing
                          ? "bg-white text-blue-500 border-black shadow-md shadow-green-200"
                          : priceAvailable
                          ? "border-solid text-green-800 border-2 border-white-100"
                          : "border-dashed text-green-800 border-2 shadow-black border-white-100"
                      } ${isDashed ? "dashed-border" : ""}`}
                      onClick={() => handlePackingSelection(packing)}
                      style={{ marginRight: "8px" }}
                    >
                      {packing}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mb-8 self-center">
          <span className="block text-xl font-bold">{props.item["salt"]}</span>
          <span className="block text-sm text-gray-500 font-semibold">
            {selectedForm} | {selectedStrength} | {selectedPacking}
          </span>
        </div>
        <div className="text-center w-[25vw] self-center">
          {lowestPrice !== null ? (
            <h3 className="text-2xl font-bold text-black-500">
              From ₹{lowestPrice}
            </h3>
          ) : (
            <h3 className="text-xl font-semibold text-black-500 border-black shadow-sm shadow-black rounded-2xl">
              No stores selling this product for the selected form, strength, and packing
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaltComponent;
