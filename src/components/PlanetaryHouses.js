import React from 'react';

const PlanetaryHouses = ({ houses }) => {
  return (
    <div className="chart-container">
      {houses.map((house, index) => (
        <div key={index} className="house">
            {index+1}
            <br />
            <hr/>
          {house ? (
            <ul>
              {house.map((planet, planetIndex) => (
                <li key={planetIndex} className="planet">
                  {planet}
                </li>
              ))}
            </ul>
          ) : (
            'null'
          )}
        </div>
      ))}
    </div>
  );
};

export default PlanetaryHouses;
