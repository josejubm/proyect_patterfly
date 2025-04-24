import React, { useEffect, useState } from 'react';
import {
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardExpandableContent,
  Divider,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  Title,
  Button,
  PageSection,
  Spinner,
  Bullseye,
  CardFooter
} from '@patternfly/react-core';
import {
  CubeIcon,
  ArrowRightIcon,
  AnsibeTowerIcon,
  EnterpriseIcon,
  MemoryIcon,
  CpuIcon,
  ServerIcon,
  LinuxIcon,
  NetworkIcon,
  FileIcon,
  UsersIcon,
  StarIcon,
  ProcessAutomationIcon,

} from '@patternfly/react-icons';
import { ChartDonutUtilization, ChartThemeColor } from '@patternfly/react-charts/victory';
import { obtenerDatosAwx } from './fetchingAwxData';
import { getResumenGlobal } from './resumenGlobal';

const Dashboard = () => {
  const [datos, setDatos] = useState({});
  const [loading, setLoading] = useState(true);
  const [resumenGlobal, setResumenGlobal] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resultado = await obtenerDatosAwx();
        setDatos(resultado);
        setResumenGlobal(getResumenGlobal());
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) return (
    <Bullseye style={{ height: '100vh' }}>
      <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem>
          <h1>Cargando ...</h1>
        </FlexItem>
        <FlexItem>
          <Spinner aria-label="Cargando" diameter="80px" />
        </FlexItem>
      </Flex>
    </Bullseye>
  );

  if (!resumenGlobal) return (
    <Bullseye style={{ height: '100vh' }}>
      <h1>Error al cargar los datos</h1>
    </Bullseye>
  );

  // Calcular totales globales
  const totalGlobal = {
    vcpus: Object.values(resumenGlobal.resumen_global).reduce((sum, item) => sum + item.total_vcpus, 0),
    ram: Object.values(resumenGlobal.resumen_global).reduce((sum, item) => sum + item.total_ram_gb, 0),
    instances: Object.values(resumenGlobal.resumen_global).reduce((sum, item) => sum + item.total_instances, 0)
  };

  return (
    <PageSection>
      <Title headingLevel="h1" size="3xl">
        Dashboard Principal
      </Title>
      <br />

      <Grid hasGutter>
        <GridItem span={12}>
          <Card isExpanded>
            <CardHeader>
              <CardTitle>
                <Title headingLevel="h2" size="xl">
                  <AnsibeTowerIcon /> Overview Ansible AWX
                </Title>
              </CardTitle>
            </CardHeader>

            <CardExpandableContent>
              <Flex direction={{ default: 'column', md: 'row' }} spaceItems={{ default: 'spaceItemsLg' }}>
                {[
                  {
                    title: 'Jobs',
                    value: datos.jobs,
                    icon: <ProcessAutomationIcon />,
                    color: 'blue',
                    description: 'Ejecuciones de automatización registradas en AWX.'
                  },
                  {
                    title: 'Hosts',
                    value: datos.hosts,
                    icon: <LinuxIcon />,
                    color: 'green',
                    description: 'Cantidad total de sistemas gestionados.'
                  },
                  {
                    title: 'Inventories',
                    value: datos.inventories,
                    icon: <NetworkIcon />,
                    color: 'purple',
                    description: 'Recursos agrupados para tareas específicas.'
                  },
                  {
                    title: 'Playbooks',
                    value: datos.playbooks,
                    icon: <FileIcon />,
                    color: 'red',
                    description: 'Scripts de automatización disponibles.'
                  },
                  {
                    title: 'Users',
                    value: datos.users,
                    icon: <UsersIcon />,
                    color: 'orange',
                    description: 'Usuarios con acceso al sistema.'
                  },
                  {
                    title: 'Organizations',
                    value: datos.organizations,
                    icon: <StarIcon />,
                    color: 'gold',
                    description: 'Estructura de entidades dentro de AWX.'
                  }
                ].map((item, index, array) => (
                  <React.Fragment key={item.title}>
                    <Flex flex={{ default: 'flex_1' }} direction={{ default: 'column' }}>
                      <Card isPlain>
                        <CardBody>
                          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                            <LabelGroup>
                              <Label color={item.color} icon={item.icon} isCompact>
                                {item.title}
                              </Label>
                            </LabelGroup>
                            <h2>{item.value}</h2>
                            <p>{item.description}</p>
                          </Flex>
                        </CardBody>
                        <CardFooter>
                          <Button variant="link" isInline>
                            Ver detalles <ArrowRightIcon />
                          </Button>
                        </CardFooter>
                      </Card>
                    </Flex>
                    {index < array.length - 1 && (
                      <Divider orientation={{ default: 'vertical' }} inset={{ default: 'insetMd' }} />
                    )}
                  </React.Fragment>
                ))}
              </Flex>

            </CardExpandableContent>

          </Card>
        </GridItem>

        {/* Segundo bloque - Resumen de Recursos */}
        <GridItem span={12}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Title headingLevel="h2" size="xl">
                  <EnterpriseIcon style={{ marginRight: '0.5rem' }} /> Resumen Global - Consumo de Recursos
                </Title>
              </CardTitle>
            </CardHeader>
            <Divider />

            <CardBody>
              <Grid hasGutter sm={12} md={12} lg={12}>
                <GridItem span={12}>
                  <Card isExpanded>
                    <CardHeader>
                      <CardTitle>
                        <Title headingLevel="h2" size="xl" style={{ width: '100%', textAlign: 'center' }}>
                          Consumo General de Recursos
                        </Title>
                      </CardTitle>
                    </CardHeader>

                    <CardExpandableContent>
                      <Flex
                        direction={{ default: 'column', md: 'row' }}
                        justifyContent={{ default: 'justifyContentCenter' }}
                        spaceItems={{ default: 'spaceItemsLg' }}
                      >
                        {[
                          {
                            title: 'Consumo Total de CPU',
                            value: totalGlobal.vcpus,
                            total: 100, // Capacidad máxima de vCPUs
                            color: ChartThemeColor.blue,
                            description: 'Total de vCPUs utilizadas en todos los proyectos',
                            icon: <CpuIcon />
                          },
                          {
                            title: 'Consumo Total de RAM',
                            value: totalGlobal.ram,
                            total: 150, // Capacidad máxima de RAM en GB
                            color: ChartThemeColor.green,
                            description: 'Total de RAM utilizada en todos los proyectos',
                            icon: <MemoryIcon />
                          },
                          {
                            title: 'Instancias Totales',
                            value: totalGlobal.instances,
                            total: 200, // Capacidad máxima de instancias
                            color: ChartThemeColor.purple,
                            description: 'Número total de instancias en ejecución',
                            icon: <ServerIcon />
                          }
                        ].map((item) => {
                          const porcentaje = Math.min((item.value / item.total) * 100, 100);

                          return (
                            <Flex
                              key={item.title}
                              direction={{ default: 'column' }}
                              spaceItems={{ default: 'spaceItemsMd' }}
                              alignItems={{ default: 'alignItemsCenter' }}
                              flex={{ default: 'flex_1' }}
                            >
                              <ChartDonutUtilization
                                ariaDesc={`${item.title} usage`}
                                ariaTitle={item.title}
                                data={{ x: item.title, y: porcentaje }}
                                height={200}
                                width={200}
                                colorScale={[item.color, '#d2d2d2']}
                                subTitle={item.title}
                                title={`${porcentaje.toFixed(0)}%`}
                                labels={({ datum }) => `${item.value} de ${item.total}`}
                                legendOrientation="vertical"
                                legendPosition="right"
                                constrainToVisibleArea
                              />
                              <LabelGroup>
                                <Label color={item.color} icon={item.icon} isCompact>
                                  {item.value} / {item.total}
                                </Label>
                              </LabelGroup>
                              <p style={{ textAlign: 'center', maxWidth: '200px' }}>{item.description}</p>
                              <br />
                            </Flex>
                          );
                        })}
                      </Flex>
                    </CardExpandableContent>
                  </Card>
                </GridItem>
              </Grid>

              <br />

              {/* Detalle por proyecto */}
              <Grid hasGutter sm={12} md={6} lg={4}>
                {Object.entries(resumenGlobal.resumen_global).map(([nombre, datos], index) => {
                  const icon = <CubeIcon />;
                  const colores = [
                    ChartThemeColor.green, ChartThemeColor.blue, ChartThemeColor.purple,
                    ChartThemeColor.orange, ChartThemeColor.cyan, ChartThemeColor.gold,
                    ChartThemeColor.red, ChartThemeColor.teal
                  ];
                  const color = colores[index % colores.length];

                  const ramPorcentaje = datos.total_ram_gb > 0 ? Math.min((datos.total_ram_gb / 128) * 100, 100) : 0;
                  const cpuPorcentaje = datos.total_vcpus > 0 ? Math.min((datos.total_vcpus / 64) * 100, 100) : 0;

                  return (
                    <GridItem key={nombre}>
                      <Card isCompact isHoverable>
                        <CardHeader>
                          <CardTitle>
                            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                              <FlexItem>
                                <Label color="blue" icon={icon}>
                                  {nombre}
                                </Label>
                              </FlexItem>
                              <FlexItem>
                                <Button variant="link" isSmall icon={<ArrowRightIcon />} iconPosition="right">
                                  Detalles
                                </Button>
                              </FlexItem>
                            </Flex>
                          </CardTitle>
                        </CardHeader>



                        <CardBody>
                          <Flex direction={{ default: 'row' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                            {/* Columna izquierda con los datos */}
                            <Flex
                              direction={{ default: 'column' }}
                              spaceItems={{ default: 'spaceItemsSm' }}
                            >
                              <p><strong>Proyectos:</strong> {datos.total_proyectos}</p>
                              <p><strong>Instancias:</strong> {datos.total_instances}</p>
                            </Flex>

                            {/* Gráficos lado a lado */}
                            <Flex
                              direction={{ default: 'row' }}
                              spaceItems={{ default: 'spaceItemsMd' }}
                              alignItems={{ default: 'alignItemsCenter' }}
                            >
                              <div style={{ width: '80px', height: '80px' }}>
                                <ChartDonutUtilization
                                  ariaDesc="Uso de CPU"
                                  ariaTitle="CPU"
                                  data={{ x: 'CPU', y: cpuPorcentaje }}
                                  labels={({ datum }) => datum.y > 0 ? `${datum.y.toFixed(1)}%` : ''}
                                  title={cpuPorcentaje > 0 ? `${cpuPorcentaje.toFixed(0)}%` : '0%'}
                                  subTitle="CPU"
                                  constrainToVisibleArea
                                  height={100}
                                  themeColor={color}
                                  width={100}
                                />
                              </div>
                              <div style={{ width: '80px', height: '80px' }}>
                                <ChartDonutUtilization
                                  ariaDesc="Uso de RAM"
                                  ariaTitle="RAM"
                                  data={{ x: 'RAM', y: ramPorcentaje }}
                                  labels={({ datum }) => datum.y > 0 ? `${datum.y.toFixed(1)}%` : ''}
                                  title={ramPorcentaje > 0 ? `${ramPorcentaje.toFixed(0)}%` : '0%'}
                                  subTitle="RAM"
                                  constrainToVisibleArea
                                  height={100}
                                  themeColor={color}
                                  width={100}
                                />
                              
                              </div>
                            </Flex>
                          </Flex>
                        </CardBody>
                      </Card>
                    </GridItem>
                  );
                })}
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
  );
};

export default Dashboard;