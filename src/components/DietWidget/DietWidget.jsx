// General Imports
import React, { useEffect, useState } from "react";

// Component Imports
import Widget from "../Widget/Widget";
import WidgetEditMenu from "../Widget/WidgetEditMenu";
import DietInfoDisplay from "./DietInfoDisplay";
import DietInfoEdit from "./DietInfoEdit";

// Util Imports
import { getPetById, getMealsByPet } from "../../utils/api";

const DietWidget = ({ petId, onDashboard }) => {
  const [pet, setPet] = useState(undefined);
  const [meals, setMeals] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  useEffect(() => {
    getPetById(petId)
      .then((res) => setPet(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getMealsByPet(petId)
      .then((res) => setMeals(res.data))
      .catch((err) => console.log(err));

    return () => setNeedsUpdate(false);
  }, [petId, needsUpdate]);

  const editMenu = (
    <WidgetEditMenu type="diet" petId={petId} setEditMode={setEditMode} />
  );

  return (
    <>
      {meals.length && pet && (
        <Widget
          title={onDashboard ? `${pet.name}'s Diet` : "Diet"}
          menu={editMenu}
          editMode={editMode}
        >
          {editMode ? (
            <DietInfoEdit
              pet={pet}
              meals={meals}
              setEditMode={setEditMode}
              setNeedsUpdate={setNeedsUpdate}
            />
          ) : (
            <DietInfoDisplay meals={meals} />
          )}
        </Widget>
      )}
    </>
  );
};

export default DietWidget;
