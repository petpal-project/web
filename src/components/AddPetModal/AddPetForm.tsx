import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import PetsContext from '../../context/PetsContext';
import { getBreeds } from '../../api';
import AuthContext from '../../context/AuthContext';
import { Breed, Gender, PetCategory, PetForm } from '../../api/pets/types';

const petCategories: PetCategory[] = [
  {
    id: 1,
    category: 'Dog'
  },
  {
    id: 2,
    category: 'Cat'
  }
];

const AddPetForm = () => {
  const [breedOptions, setBreedOptions] = useState<Breed[]>([]);
  const [name, setName] = useState<string>();
  const [categoryId, setCategoryId] = useState<number>();
  const [breedId, setBreedId] = useState<number>();
  const [gender, setGender] = useState<Gender>();
  const [birthday, setBirthday] = useState<string>();
  const [weight, setWeight] = useState<number>();

  const navigate = useNavigate();
  const { addPet } = useContext(PetsContext);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    getBreeds().then((res) => setBreedOptions(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !birthday || !gender || !weight || !categoryId || !breedId) { return; }
    const newPet: PetForm = {
      name: name,
      birthday: birthday,
      gender: gender,
      weight: weight,
      category_id: categoryId,
      breed_id: breedId,
      user_id: user!.id,
    };
    addPet(newPet);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Container>
          <Row>
            <Col className="d-flex justify-content-start">Name:</Col>
            <Col>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-start">Category:</Col>
            <Col>
              <select onChange={(e) => setCategoryId(parseInt(e.target.value))}>
                <option value={undefined}>---</option>
                {petCategories.map((c) => {
                  return (
                    <option key={c.id} value={c.id}>
                      {c.category}
                    </option>
                  );
                })}
              </select>
            </Col>
          </Row>
          {categoryId !== null && (
            <Row>
              <Col className="d-flex justify-content-start">Breed:</Col>
              <Col>
                <select onChange={(e) => setBreedId(parseInt(e.target.value))}>
                  <option value={undefined}>---</option>
                  {breedOptions.filter(b => b.category.id === categoryId).map((b) => {
                    return (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    );
                  })}
                </select>
              </Col>
            </Row>
          )}
          <Row>
            <Col className="d-flex justify-content-start">Gender:</Col>
            <Col>
              <select onChange={(e) => setGender(e.target.value as Gender)}>
                <option value={undefined}>---</option>
                {['Male', 'Female', 'Unknown'].map((g) => {
                  return (
                    <option key={g} value={g.slice(0, 1)}>
                      {g}
                    </option>
                  );
                })}
              </select>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-start">Birthday:</Col>
            <Col>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-start">Weight:</Col>
            <Col>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <button type="submit">Create Pet</button>
              <button onClick={() => navigate('/dashboard')}>Cancel</button>
            </Col>
          </Row>
        </Container>
      </form>
    </div>
  );
};

export default AddPetForm;
