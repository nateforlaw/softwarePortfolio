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
            case 'js': return (<pre>{``}</pre>);
            case 'php': return (<pre>{``}</pre>);
            case 'sql': return (<pre>{``}</pre>);
        }
    };
}

export default Snippet;