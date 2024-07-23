from sqlalchemy import Column, Integer, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Coordinate(Base):
    __tablename__ = 'coordinates'

    id = Column(Integer, primary_key=True, index=True)
    x_axis = Column(Float, nullable=False)
    y_axis = Column(Float, nullable=False)