from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated, List
from sqlalchemy import text
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine
import models 
#Using FastAPI, SQLAlchemy, and Pydantic for creating a REST API with CRUD operations.
#This file should used to create a REST API in order to write data to the database.
app = FastAPI()
models.Base.metadata.create_all(bind=engine)
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        
db_dependency = Annotated[Session, Depends(get_session)]

# Pydantic model for data insertion
class CoordinateCreate(BaseModel):
    x_axis: float
    y_axis: float

@app.get("/data/")
async def get_data(session: Session = Depends(get_session)):
    query = text('SELECT "x_axis" AS x_axis, "y_axis" AS y_axis FROM data2')
    result = session.execute(query)
    data_points = result.fetchall()
    return [{"x_axis": row.x_axis, "y_axis": row.y_axis} for row in data_points]

@app.post("/data/", response_model=CoordinateCreate)
async def create_data(coordinate: CoordinateCreate, session: Session = Depends(get_session)):
    insert_query = text('INSERT INTO data2 ("x_axis", "y_axis") VALUES (:x_axis, :y_axis)')
    #data2 means database table name, ("x_axis", "y_axis") means column names in the table
    session.execute(insert_query, {"x_axis": coordinate.x_axis, "y_axis": coordinate.y_axis})
    session.commit()
    return coordinate