import React from 'react';

class Snippet extends React.Component {
    render() {
        switch (this.props.type) {
            default: return (<div>Error, code did not load.</div>);
            case 'java': return (<pre>{`
    import javafx.application.Application;
    import javafx.stage.Stage;
    import javafx.scene.Scene;
    import javafx.scene.layout.FlowPane;
    import javafx.scene.control.Button;
    import javafx.scene.image.Image;
    import javafx.scene.image.ImageView;
    import javafx.geometry.Pos;
    import javafx.scene.Group;
    import javafx.application.Platform;
    import javafx.scene.control.Label;
    import javafx.scene.layout.VBox;
    import javafx.scene.layout.HBox;
    import java.util.ArrayList;
    import javafx.scene.input.MouseEvent;
    import javafx.geometry.Pos;

    //swing is seperate. used for error window
    import javax.swing.JOptionPane;

    public class Kiosk extends Application
    {
        //main stage
        Seat[][] seats;
        Label priceFinal;
        double finalPrice = 0;
        Stage mainStage;
        
        //error box
        ErrorBox err;
        
        //varibles for window placement.
        double originX;
        double originY;
        
        //screen operation
        Label price;
        double currentOrder = 0;
        boolean screenOpen = false;
        
        //order printing
        ArrayList<Seat[][]> orders = new ArrayList<Seat[][]>();
        ArrayList<Stage> stages = new ArrayList<Stage>();
        boolean ordersOpen = false;
        Stage stageX;
        
        public Kiosk()
        {
            //make seats, initilize them to respective prices
            seats = new Seat[10][8];
            for(int a = 0; a < seats.length; a++)
            {
                for(int b = 0; b < seats[0].length; b++)
                {
                    if(a<=4)
                        seats[a][b] = new Seat(14.99);
                    else if(a>4 && a<=7)
                        seats[a][b] = new Seat(10.49);
                    else
                        seats[a][b] = new Seat(6.99);
                }
            }
        }
        
        public void start(Stage stage)
        {
            mainStage = stage;
            
            //exits whole program when this stage is closed
            mainStage.setOnCloseRequest((ae) -> {
                Platform.exit();
                System.exit(0);
            });
            
            //bunch of layout elemsnts
            FlowPane root = new FlowPane();
            Scene scene = new Scene(root);
            root.setAlignment(Pos.CENTER);
            
            VBox box = new VBox();
            
            priceFinal = new Label("$ 0.00");
            
            //couple buttons
            Button btn = new Button("New Order");
            btn.setOnAction(eve-> screenOperation());
            
            Button btn2 = new Button("View Orders");
            btn2.setOnAction(eve-> printOrders());
            
            //add them to the vbox
            box.getChildren().add(priceFinal);
            box.getChildren().add(btn);
            box.getChildren().add(btn2);
            
            root.getChildren().add(box);
            
            //setup of mainstage for display
            mainStage.setTitle("Kiosk");
            mainStage.setWidth(300);
            mainStage.setHeight(200);
            mainStage.setScene(scene); 
            mainStage.show();
            
            //sets variables for middle of screen(stage opens in middle by default)
            originX = mainStage.getX();
            originY = mainStage.getY();
        }
        
        public void run()
        {
            Application.launch();
        }
        
        public void screenOperation()
        {
            if(!screenOpen)
            {
                screenOpen = true;
                
                //for a nice looking layout
                VBox rows = new VBox();
                VBox mastervbox = new VBox();
                
                currentOrder = 0;
                Stage stage = new Stage();
                
                /* on close request in charge of multiple things:
                    * - adding order to list of orders for later or concurrent use
                    * - opening an instance of the order if orders are being displayed
                    * - adds order price to final price
                    * - locks seats so they cant be re-selected   */
                stage.setOnCloseRequest((ae) -> {
                    if(currentOrder != 0)
                    {
                        orders.add(getCurrentSeats());
                        lockSeats();
                        finalPrice += currentOrder;
                        String x = "$ " + Double.toString(Math.round(finalPrice*100.0)/100.0);
                        if(x.substring(x.indexOf('.')).length() == 2)
                            x += "0";
                        priceFinal.setText(x);
                        if(ordersOpen)
                            updateOrders();
                    }
                    screenOpen = false;
                });
                
                Image seatOpen = new Image("seatOpen.png");
                Image seatTaken = new Image("seatTaken.png");
                
                price = new Label("$ 0.00");
                
                //initilize bigScreen image
                ImageView bigScreen = new ImageView(new Image("bigScreen.png"));
                bigScreen.setFitWidth(600);
                bigScreen.setFitHeight(100);
                bigScreen.setSmooth(true);
            
                Group root = new Group();
                Scene scene = new Scene(root);
                
                for(int a = 0; a < seats.length; a++)
                {
                    HBox box = new HBox();
                    for(int b = 0; b < seats[0].length; b++)
                    { 
                        /* resizes the image to have width of 100 /
                        /  while preserving the ratio and using   /
                        /  higher quality filtering method;       /
                        /  each ImageView is also cached to       /
                        /  improve performance                   */
                        if(seats[a][b].getOpen())
                            seats[a][b].setImage(seatOpen);
                        else
                            seats[a][b].setImage(seatTaken);
                        seats[a][b].setFitWidth(75);
                        seats[a][b].setPreserveRatio(true);
                        seats[a][b].setSmooth(true);
                        seats[a][b].setCache(true);
                        seats[a][b].setOnMouseClicked((MouseEvent e) -> {
                            seatClicked((Seat)e.getSource());
                        });
                        
                        //set up layout and window
                        box.getChildren().add(seats[a][b]);
                    }
                    //add hbox to vbox
                    rows.getChildren().add(box);
                }
                
                //add screen to the rest
                mastervbox.getChildren().add(price);
                mastervbox.getChildren().add(bigScreen);
                mastervbox.getChildren().add(rows);
                
                //add vbox to root
                root.getChildren().add(mastervbox);
                
                //average stage setup
                stage.setTitle("Screen");
                stage.setScene(scene); 
                stage.sizeToScene(); 
                stage.setResizable(false);
                stage.show();
            }
            else
            {
                if(err != null)
                    err.stage.close();
                err = new ErrorBox("Screen already open!");
            }
        }
        
        //handles seat being clicked
        public void seatClicked(Seat seat)
        {
            Image seatOpen = new Image("seatOpen.png");
            Image seatSelected = new Image("seatSelected.png");
            
            //switches between clicked and unclicked
            if(!seat.getLocked())
            {
                if(seat.getOpen())
                {
                    seat.setImage(seatSelected);
                    seat.setOpen(false);
                    currentOrder+=seat.getPrice();
                }
                else
                {
                    seat.setImage(seatOpen);
                    seat.setOpen(true);
                    currentOrder-=seat.getPrice();
                }
                //set price every time regaurdless
                String x = "$ " + Double.toString(Math.round(currentOrder*100.0)/100.0);
                if(x.substring(x.indexOf('.')).length() == 2)
                        x += "0";
                price.setText(x);
            }
        }
        
        //locks all seats that have been slected by user.
        public void lockSeats()
        {
            for(int a = 0; a < seats.length; a++)
            {
                for(int b = 0; b < seats[0].length; b++)
                {
                    if(!seats[a][b].getOpen())
                        seats[a][b].lock();
                }
            }
        }
        
        public void printOrders()
        {
            //checking for error cases
            if(orders.size() > 0)
                if(!ordersOpen)
                {
                    ordersOpen = true;
                    
                    //instuctional window
                    stageX = new Stage();
                    stageX.setOnCloseRequest((ae) -> {
                            Runnable r = new SinMove(mainStage,originX,originY);
                            new Thread(r).start();
                            closeStages();
                            ordersOpen = false;
                        });
                    
                    FlowPane rootX = new FlowPane();
                    rootX.setAlignment(Pos.CENTER);
                    Scene sceneX = new Scene(rootX, 250, 75);
                    
                    rootX.getChildren().add(new Label("To remove an order close it,\n or exit this prompt to quit.\nYou can still make additional orders."));
                    stageX.setScene(sceneX);
                    stageX.show();
                    
                    //moves stages to positions
                    Runnable r = new SinMove(stageX,stageX.getX(),stageX.getY()-200);
                    new Thread(r).start();
                    
                    r = new SinMove(mainStage,originX,originY+300);
                    new Thread(r).start();
                    
                    //opens each stage using orders array
                    for(int i = 0; i < orders.size(); i++)
                    {
                        double currentPrice = 0;
                        
                        Stage stage = new Stage();
                        
                        stage.setOnCloseRequest((ae) -> {
                            Platform.runLater(new Runnable() {
                                @Override public void run() {
                                    closeStages();
                                }
                            });
                        });
                        
                        VBox rows = new VBox();
                        VBox mastervbox = new VBox();
                        HBox notscreen = new HBox();
                        
                        Image seatOpen = new Image("seatOpen.png");
                        Image seatTaken = new Image("seatTaken.png");
                        
                        ImageView bigScreen = new ImageView(new Image("bigScreen.png"));
                        bigScreen.setFitWidth(200);
                        bigScreen.setFitHeight(33);
                        bigScreen.setSmooth(true);
                        
                        Group root = new Group();
                        Scene scene = new Scene(root);
                        
                        //initilize instance of orders onto each stage
                        for(int a = 0; a < orders.get(i).length; a++)
                        {
                            HBox box = new HBox();
                            for(int b = 0; b < orders.get(i)[0].length; b++)
                            { 
                                //copy paste modify
                                if(orders.get(i)[a][b].getOpen())
                                    orders.get(i)[a][b].setImage(seatOpen);
                                else
                                {
                                    orders.get(i)[a][b].setImage(seatTaken);
                                    currentPrice += orders.get(i)[a][b].getPrice();
                                }
                                orders.get(i)[a][b].setFitWidth(25);
                                orders.get(i)[a][b].setPreserveRatio(true);
                                orders.get(i)[a][b].setSmooth(true);
                                orders.get(i)[a][b].setCache(true);
                                
                                //set up layout and window
                                box.getChildren().add(orders.get(i)[a][b]);
                            }
                            //add hbox to vbox
                            rows.getChildren().add(box);
                        }
                        
                        String x = "$ " + Double.toString(Math.round(currentPrice*100.0)/100.0);
                        if(x.substring(x.indexOf('.')).length() == 2)
                                x += "0";
                        Label price = new Label(x);
                        
                        //add screen to the rest
                        mastervbox.getChildren().add(price);
                        mastervbox.getChildren().add(bigScreen);
                        mastervbox.getChildren().add(rows);
                        
                        //add vbox to root
                        root.getChildren().add(mastervbox);
                        
                        stage.setTitle("No. " + Integer.toString(i+1));
                        stage.setScene(scene); 
                        stage.sizeToScene();
                        stage.setResizable(false);
                        stages.add(stage);
                        stages.get(i).show();
                    }
                    //sorts the stages for user to view
                    r = new Sort(stages);
                    new Thread(r).start();
                }
                else
                {
                    //error for orders already open
                    if(err != null)
                        err.stage.close();
                    err = new ErrorBox("Orders already open!");
                }
            else
            {
                //error for ordes non existeint
                if(err != null)
                        err.stage.close();
                err = new ErrorBox("There arent any orders!");
            }
        }
        
        public void updateOrders()
        {
            //copy code from printOrders() to last element of orders array
            double currentPrice = 0;
                    
            Stage stage = new Stage();
            
            stage.setOnCloseRequest((ae) -> {
                Platform.runLater(new Runnable() {
                    @Override public void run() {
                        closeStages();
                    }
                });
            });
            
            VBox rows = new VBox();
            VBox mastervbox = new VBox();
            HBox notscreen = new HBox();
            
            Image seatOpen = new Image("seatOpen.png");
            Image seatTaken = new Image("seatTaken.png");
            
            ImageView bigScreen = new ImageView(new Image("bigScreen.png"));
            bigScreen.setFitWidth(200);
            bigScreen.setFitHeight(33);
            bigScreen.setSmooth(true);
            
            Group root = new Group();
            Scene scene = new Scene(root);
            
            for(int a = 0; a < orders.get(orders.size()-1).length; a++)
            {
                HBox box = new HBox();
                for(int b = 0; b < orders.get(orders.size()-1)[0].length; b++)
                { 
                    //copy paste modify
                    if(orders.get(orders.size()-1)[a][b].getOpen())
                        orders.get(orders.size()-1)[a][b].setImage(seatOpen);
                    else
                    {
                        orders.get(orders.size()-1)[a][b].setImage(seatTaken);
                        currentPrice += orders.get(orders.size()-1)[a][b].getPrice();
                    }
                    orders.get(orders.size()-1)[a][b].setFitWidth(25);
                    orders.get(orders.size()-1)[a][b].setPreserveRatio(true);
                    orders.get(orders.size()-1)[a][b].setSmooth(true);
                    orders.get(orders.size()-1)[a][b].setCache(true);
                    
                    //set up layout and window
                    box.getChildren().add(orders.get(orders.size()-1)[a][b]);
                }
                //add hbox to vbox
                rows.getChildren().add(box);
            }
            
            String x = "$ " + Double.toString(Math.round(currentPrice*100.0)/100.0);
            if(x.substring(x.indexOf('.')).length() == 2)
                    x += "0";
            Label price = new Label(x);
            
            //add screen to the rest
            mastervbox.getChildren().add(price);
            mastervbox.getChildren().add(bigScreen);
            mastervbox.getChildren().add(rows);
            
            //add vbox to root
            root.getChildren().add(mastervbox);
            
            //your average stage setup
            stage.setTitle("No. " + Integer.toString(orders.size()));
            stage.setScene(scene); 
            stage.sizeToScene(); 
            stages.add(stage);
            stages.get(orders.size()-1).show();
            
            //redisplays the orders in a nice way
            Runnable r = new Sort(stages);
            new Thread(r).start();
        }
        
        public Seat[][] getCurrentSeats()
        {
            //new array and initilize it
            Seat[][] out = new Seat[10][8];
            for(int a = 0; a < out.length; a++)
            {
                for(int b = 0; b < out[0].length; b++)
                {
                    if(a<=4)
                        out[a][b] = new Seat(14.99);
                    else if(a>4 && a<=7)
                        out[a][b] = new Seat(10.49);
                    else
                        out[a][b] = new Seat(6.99);
                }
            }
            
            //checks for non-locked but taken seats
            //then locks correspoding seats on the new array
            for(int a = 0; a < out.length; a++)
                for(int b = 0; b < out[0].length; b++)
                    if(!seats[a][b].getLocked() && !seats[a][b].getOpen())
                        out[a][b].lock();
            return out;
        }
        
        public void closeStages()
        {
            //finds the stage that has closed
            int index = -1;
            for(int i = 0; i < stages.size(); i++)
            {
                if(!stages.get(i).isShowing())
                    index = i;
            }
            
            //if index is available, subtract that total and close other stages
            if(index != -1)
            {
                //remove proce
                finalPrice -= getPrice(orders.get(index));
                String x = "$ " + Double.toString(Math.round(finalPrice*100.0)/100.0);
                if(x.substring(x.indexOf('.')).length() == 2)
                    x += "0";
                priceFinal.setText(x);
                
                //clears the seats from the main array
                for(int a = 0; a < seats.length; a++)
                {
                    for(int b = 0; b < seats[0].length; b++)
                    {
                        if(!orders.get(index)[a][b].getOpen() && !seats[a][b].getOpen())
                            seats[a][b] = new Seat(seats[a][b].getPrice());
                    }
                }
                
                //removes it from the list
                orders.remove(index);
                stages.remove(index);
                
                //resorts the stages
                Runnable r = new Sort(stages);
                new Thread(r).start();
                
                //close everything if the last order was closed
                if(stages.size() == 0)
                {
                    stageX.close();
                    ordersOpen = false;
                    r = new SinMove(mainStage,originX,originY);
                    new Thread(r).start();
                }
            }
            //if none have closed(-1) close all other stages
            else
            {
                for(int i = 0; i < stages.size(); i++)
                {
                    stages.get(i).close();
                }
                stages.clear();
                stageX.close();
                //no ordersOpen = false; because its onCloseRequest for stageX
            }
        }
        
        //returns price of array of seats
        public double getPrice(Seat[][] seats)
        {
            double rtrn = 0;
            for(int a = 0; a < seats.length; a++)
            {
                for(int b = 0; b < seats[0].length; b++)
                {
                    if(!seats[a][b].getOpen())
                        rtrn += seats[a][b].getPrice();
                }
            }
            return rtrn;
        }
        
        public class Sort implements Runnable 
        {
            ArrayList<Stage> stages;
            double[] coordEdit;
            double length = 100;
            
            public Sort(ArrayList<Stage> stages) 
            {
                this.stages = stages;
            }
        
            public void run() 
            {
                coordEdit = new double[2];
                //sets length of the windows baised on how many there are
                length += (stages.size()*(10.0/(stages.size()/2.0)));
                for(int i = 0; i < stages.size(); i++)
                {
                    //sets each stage position, to evenly spread them out
                    coordEdit[0] = originX + (((length*stages.size())/stages.size())*(i+1)) - (length/2)*stages.size() - 20;
                    coordEdit[1] = originY;
                    
                    //activiate
                    Runnable r = new SinMove(stages.get(i),coordEdit[0],coordEdit[1]);
                    new Thread(r).start();
                }
            }
        }
        
        public class SinMove implements Runnable
        {
            Stage stage;
            public double dx; //destination x
            public double dy; //destination y
            double cx; //current x
            double cy; //current y
            double x; //temp value
            double y; //temp value
            
            public SinMove(Stage stage, double dx, double dy)
            {
                this.stage = stage;
                this.dx = dx;
                this.dy = dy;
                cx = stage.getX();
                cy = stage.getY();
            }
            
            public void run()
            {
                do
                {
                    //value window will move by each tick
                    x = (x*.4)+((dx-cx)*.1);
                    y = (y*.4)+((dy-cy)*.1);
                    
                    //moves window
                    stage.setX(stage.getX()+x);
                    stage.setY(stage.getY()+y);
                    
                    //gets new position
                    cx = stage.getX();
                    cy = stage.getY();
                    
                    //tick 1000/20 times per second
                    try{Thread.sleep(20);}catch(Exception e){}
                }while((x>.1 || x<-.1) || (y>.1 || y<-.1));
            }
        }
    }
            `}</pre>);
            case 'js': return (<pre>{`
    import React from "react";
    import Repo from "./api/repo.js";
    import Logic from "./api/gamelogic.js";
    import Controls from "./components/controls.jsx";
    import PlayArea from "./components/playarea.jsx";
    import Dialogs from "./components/dialogs.jsx";
    
    //This manages the game. Calls on the repo to change values, and controlls logic.
    class Game extends React.Component {
    
    constructor(props) {
        super(props);
        var repo = new Repo();
    
        this.state = {
        repo: repo, //Server side || game_game
    
        //manager data || Server Side || game_data
        currentPlayer: 0,
        reversed: false,
        skip: false,
        forceDraw: 0,
        currentColor: repo.playPile[repo.playPile.length - 1].color,
    
        //options data || Client Side
        optionsOpen: false,
        autoPlayAI: false,
        stopOnPlayer: false,
        hideComputers: false,
    
        //snakedata || Client Side
        snakeIteration: 0,
    
        //dialog data || Client Side
        colorOpen: false,
        winnerOpen: false,
        winningMessage: "",
        rules1Open: true,
        rules2Open: false,
        rules3Open: false,
        helpOpen: false,
        };
    
        //On right arrow key press
        window.onkeydown = (e) => {
        if (e.keyCode === 39 && !this.state.colorOpen && !this.state.winnerOpen) {
            this.turnAI();
        }
        }
    }
    
    //Passes control and state down to a logic api in order to consolidate ideas.
    turnPlayer = card => {
        var newState = Logic.turnPlayer(card, this.state);
        this.setState(newState);
    }
    turnAI = () => {
        var newState = Logic.turnAI(this.state);
        this.setState(newState);
    }
    
    //Play actions
    addAI = () => {
        var repo = this.state.repo;
        if (repo.deck.length <= 7) repo.updateDeck();
        if (repo.deck.length > 7) {
        repo.addPlayer();
        }
        this.setState({ repo: repo });
    }
    addPlayer = () => {
        var repo = this.state.repo;
        if (repo.deck.length <= 7) repo.updateDeck();
        if (repo.deck.length > 7) {
        repo.addPlayer();
        repo.players[repo.players.length - 1].computer = false;
        }
        this.setState({ repo: repo });
    }
    removePlayer = index => {
        var repo = this.state.repo;
        var currentPlayer = this.state.currentPlayer;
        var currentPlayerObj = repo.players[currentPlayer];
        const len = repo.players[index].hand.length;
        for (let i = 0; i < len; i++)
        repo.deck.push(repo.players[index].hand.pop());
        repo.players.splice(index, 1);
        repo.shuffle();
    
        //adjust current player
        if (repo.players.length !== 0) {
        if (currentPlayer === index)
            currentPlayer += this.state.reversed ? -1 : 0;
        else
            currentPlayer = repo.players.indexOf(currentPlayerObj);
        if (currentPlayer < 0) currentPlayer = repo.players.length - 1; //Bottom boundry
        if (currentPlayer > repo.players.length - 1) currentPlayer = 0; //Top boundry
        }
    
        this.setState({ repo: repo, currentPlayer: currentPlayer, skip: false });
    }
    handleCardClick = card => {
        this.turnPlayer(card);
    }
    
    //Dialog actions
    closeRulesDialog = (value, next) => {
        var rules1Open = this.state.rules1Open;
        var rules2Open = this.state.rules2Open;
        var rules3Open = this.state.rules3Open;
        switch (value) {
        case 1:
            document.getElementById("curtain").className = "curtain"
            if (next) {
            rules2Open = true;
            }
            else {
            document.getElementById("rulesButton").className = "rules"
            }
            rules1Open = false;
            break;
    
        case 2:
            if (next) {
            rules3Open = true;
            }
            else {
            document.getElementById("rulesButton").className = "rules"
            }
            rules2Open = false;
            break;
    
        case 3:
            rules3Open = false;
            document.getElementById("rulesButton").className = "rules"
            break;
    
        default:
            break;
        }
        this.setState({ rules1Open: rules1Open, rules2Open: rules2Open, rules3Open: rules3Open });
    }
    closeWinDialog = () => {
        this.setState({ winnerOpen: false });
    }
    closeColorDialog = color => {
        var state = this.state;
        if (state.colorOpen) {
        state.colorOpen = false;
        state.currentColor = color;
        state.repo.playPile[state.repo.playPile.length - 1].color = state.currentColor;
    
        if (state.autoPlayAI === true && state.repo.players[state.currentPlayer].computer === true) {
            var newState = Logic.turnAI(state);
            this.setState(newState);
        } else {
            this.setState({ colorOpen: state.colorOpen, currentColor: state.currentColor, repo: state.repo });
        }
        }
    }
    toggleHelpDialog = () => {
        if (this.state.optionsOpen) {
        this.setState({ helpOpen: !this.state.helpOpen });
        }
    }
    
    //Option actions
    toggleOptionsMenu = () => {
        this.setState({ optionsOpen: !this.state.optionsOpen });
    }
    toggleOption = (option) => {
        switch (option) {
        case 1:
            this.setState({ autoPlayAI: !this.state.autoPlayAI });
            break;
        case 2:
            this.setState({ stopOnPlayer: !this.state.stopOnPlayer });
            break;
        case 3:
            this.setState({ hideComputers: !this.state.hideComputers });
            break;
        default:
            break;
        }
    
    }
    
    //Background
    renderBackground() {
        return (
        <div className="area" >
            <ul className={"circles c-" + this.state.currentColor + " " + (this.state.reversed ? "c-up" : "c-down")}>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            </ul>
        </div >
        );
    }
    
    render() {
        return (
        <div id="main">
            {this.renderBackground()}
    
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"></link>
    
            <div id="curtain"></div>
    
            <Controls
            optionsOpen={this.state.optionsOpen}
            autoPlayAI={this.state.autoPlayAI}
            hideComputers={this.state.hideComputers}
            stopOnPlayer={this.state.stopOnPlayer}
    
            turnAI={this.turnAI}
            addAI={this.addAI}
            addPlayer={this.addPlayer}
            toggleOptionsMenu={this.toggleOptionsMenu}
            toggleOption={this.toggleOption}
            toggleHelpDialog={this.toggleHelpDialog}
            closeRulesDialog={this.closeRulesDialog} />
    
            <PlayArea
            repo={this.state.repo}
            hideComputers={this.state.hideComputers}
            currentPlayer={this.state.currentPlayer}
            currentColor={this.state.currentColor}
            snakeIteration={this.state.snakeIteration}
    
            removePlayer={this.removePlayer}
            handleCardClick={this.handleCardClick} />
    
            <Dialogs
            colorOpen={this.state.colorOpen}
            winnerOpen={this.state.winnerOpen}
            winningMessage={this.state.winningMessage}
            rules1Open={this.state.rules1Open}
            rules2Open={this.state.rules2Open}
            rules3Open={this.state.rules3Open}
            helpOpen={this.state.helpOpen}
    
            closeRulesDialog={this.closeRulesDialog}
            closeWinDialog={this.closeWinDialog}
            closeColorDialog={this.closeColorDialog}
            toggleHelpDialog={this.toggleHelpDialog} />
    
    
        </div>
        );
    }
    }
    
    export default Game;
            `}</pre>);
    case 'c': return (<pre>{`
    #include "util.h"
    #include "pgmimg.h"
    #include "quality.h"
    #include "zigzag.h"
    #include "bitio.h"
    
    int main(int argc, char **argv)
    {
        FILE *iFile; // .pgm input
        FILE *oFile; // .dat output
        int quality = 50;
    
        PGM image;
    
        iFile = fopen(argv[1], "rb");
        oFile = fopen(argv[2], "wb");
        if(argc == 4) {
            quality = atoi(argv[3]);
        }
    
        //Read Image
        image = readPGM(iFile);
    
        //Write Header
        fprintf(oFile,"%c",(char)image.fatness);
        fprintf(oFile,"%c",(char)(image.fatness >> 8));
        fprintf(oFile,"%c",(char)image.tallness);
        fprintf(oFile,"%c",(char)(image.tallness >> 8));
        fprintf(oFile,"%c",(char)quality);
        fprintf(oFile,"%c",image.format[1]);
    
        for(int i = 0; i < image.blockCount; i++) {
            //Add Averages to Matrices
            image.blockBuffer[i].avg = ComputeAverage(image.blockBuffer[i]);
            if(image.format[1] == '6') {
                image.blockBuffer2[i].avg = ComputeAverage(image.blockBuffer2[i]);
                image.blockBuffer3[i].avg = ComputeAverage(image.blockBuffer3[i]);
            }
    
            //Compute DCT Coefficients
            image.blockBuffer[i] = computeDCT(image.blockBuffer[i], quality);
            if(image.format[1] == '6') {
                image.blockBuffer2[i] = computeDCT(image.blockBuffer2[i], quality);
                image.blockBuffer3[i] = computeDCT(image.blockBuffer3[i], quality);
            }
    
            //ZigZag Encode
            image.blockBuffer[i] = zigZagEncode(image.blockBuffer[i]);
            if(image.format[1] == '6') {
                image.blockBuffer2[i] = zigZagEncode(image.blockBuffer2[i]);
                image.blockBuffer3[i] = zigZagEncode(image.blockBuffer3[i]);
            }
    
            //Write Bits
            writeBlock(image.blockBuffer[i], oFile);
            if(image.format[1] == '6') {
                writeBlock(image.blockBuffer2[i], oFile);
                writeBlock(image.blockBuffer3[i], oFile);
            }
        }
    }`}</pre>);
            case 'php': return (<pre>{`
    <?php
        // get the data from the form
        $rate = filter_input(INPUT_POST, 'rate', 
                FILTER_VALIDATE_FLOAT);
        $hours = filter_input(INPUT_POST, 'hours', 
                FILTER_VALIDATE_FLOAT);
    
        // validate rate
        if ( $rate === NULL || $rate === FALSE ) {
            $error_message = 'Rate must be a valid number.'; }
        else if ( $rate < 0 ) {
            $error_message = 'Rate must be greater than or equal to zero.'; }
    
        // validate hours
        else if ( $hours === NULL || $hours === FALSE ) {
            $error_message = 'Hours must be a valid number.'; }
        else if ( $hours < 0 ) {
            $error_message = 'Hours must be greater than or equal to zero.'; }
    
        // set error message to empty string if no invalid entries
        else {
            $error_message = ''; }
    
        // if an error message exists, go to the index page
        if ($error_message != '') {
            include('index.php');
            exit();
        }
    
        // calculate the future value
        $earnings = $hours * $rate;
    
        // apply currency and percent formatting
        $rate_f = '$'.number_format($rate, 2);
        $earnings_f = '$'.number_format($earnings, 2);
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Work hours calculator</title>
        <link rel="stylesheet" type="text/css" href="main.css"/>
    </head>
    <body>
        <main>
            <h1>Work hours calculator</h1>
    
            <label>Hourly Rate:</label>
            <span><?php echo $rate_f; ?></span><br>
    
            <label>Hours Worked:</label>
            <span><?php echo $hours; ?></span><br>
    
            <label>Gross Earnings:</label>
            <span><?php echo $earnings_f; ?></span><br>
        </main>
    </body>
    </html>`}</pre>);
            case 'sql': return (<pre>{`
CREATE PROCEDURE [dbo].[usp_UpsertItem] 
    -- Add the parameters for the stored procedure here
    @pContentID varchar(30) = null, 
    @pTitle varchar(255) = null,
    @pTeaser varchar(255) = null 
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;

    BEGIN TRANSACTION

        UPDATE dbo.Item WITH (SERIALIZABLE)
        SET Title = @pTitle,
            Teaser = @pTeaser
        WHERE ContentID = @pContentID

        IF @@rowcount = 0
            INSERT INTO dbo.Item (ContentID, Title, Teaser)
            VALUES (@pContentID, @pTitle, @pTeaser)

    COMMIT TRANSACTION
END
            `}</pre>);
        }
    };
}

export default Snippet;