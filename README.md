<p align="center">
<img src="assets/CheeseChain.png" width="250x"></img>
</p>

# Application of Blockchain Technology in the Swiss Cheese Supply Chain (CheeseChain) 

The CheeseChain project description and publications can be found [here](https://www.csg.uzh.ch/csg/en/research/CheeseChain.html).


## Project Structure
    .
    ├── assets                  # Images/Resources
    ├── private                 # Internal-related systems
    │   ├── db2bc                  # Database to Blockchain (DB2BC) System
    │   ├── fears                  # Form Explorer and Answers Retrieval System (FEARS)
    │   └── contract               # Smart Contract deployed in the private BC
    ├── public                  # Externally accessible system
    │   ├── chain                  # Smart Contract codes
    │   ├── frontend               # Frontend to interact with the system
    │   └── server                 # API to interact with the system
    ├── services                # Linux .service files for easy management
    └── README.md


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/)
