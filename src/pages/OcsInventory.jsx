import React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
} from '@patternfly/react-core';

const Dashboard = () => {
  const cards = [
    { id: 1, title: 'Estado general', content: 'OK' },
    { id: 2, title: 'Métrica 1', content: 'Valor 1' },
    { id: 3, title: 'Métrica 2', content: 'Valor 2' },
    { id: 4, title: 'Métrica 3', content: 'Valor 3' },
    { id: 5, title: 'Métrica 4', content: 'Valor 4' },
  ];

  return (
    <Grid hasGutter>
      {cards.map((card, index) => (
        <GridItem
          key={card.id}
          span={12}        // default: full width
          md={12}          // medium screens (tablet): full width
          lg={index === 0 ? 12 : 6}  // large screens: 1 full-width, luego de 2 en 2
        >
          <Card>
            <CardTitle>{card.title}</CardTitle>
            <CardBody>{card.content}</CardBody>
          </Card>
        </GridItem>
      ))}
      
    </Grid>
  );
};

export default Dashboard;
