class Menu{

	displayTitle(){

	}
	displayIntro(){
		if(!game){
			return;
		}

		push()
		camera.translateToView();
		fill(255, 0, 0)
		textSize(20)
		textAlign(CENTER)
		strokeWeight(1)
		text("Our dimension is running out of energy.", map2.width/2, -map2.height/4-200);
		text("[ initiating void walkers program ]", map2.width/2, -map2.height/4-180);
		text("May the harvest begin...", map2.width/2, -map2.height/4-160);
		pop();
	}
	displayInGameUI(){
		fill(255, 255, 20)
		noStroke()
		rect(15, 565-67, player.healthPerc * 200, 20, 40)

		noFill()
		stroke(255)
		strokeWeight(2)
		rect(15, 565-67, 200, 20, 40)

		fill(0)
		rect(400, 550-67, 200, 50, 20, 0, 10, 0)

		fill(255)
		textSize(32)
		textAlign(RIGHT)
		text(score, 590, 587-67)

		noFill()
		rect(0, 0, width, height, 10)
		stroke(255,0,0)

		if (player.healthPerc <= 0){
			game = godMode;
		}
	}

	displayGameOver(){
		textSize(59)
		fill(200, 0, 0)
		textAlign(CENTER)
		text('GAME OVER', width/2, 200)

		textSize(30)
		textAlign(CENTER)
		fill(255)
		stroke(255,0,0)
		text('Your final score is:', width/2, 300)

		fill(255,215, 0)
		text(score, width/2, 350)

		textSize(15)
		fill(255)
		text("press (R) to restart", width/2, 450)

		stroke(255)
		noFill()
		rect(0, 0, width, height, 10)
		noStroke()
	}
}
