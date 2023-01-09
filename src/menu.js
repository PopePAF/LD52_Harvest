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
		text("Our dimension is running out of energy.", map2.width/2, -map2.height/4-200);
		text("Initiating void walkers program", map2.width/2, -map2.height/4-180);
		text("Let the harvest begin...", map2.width/2, -map2.height/4-160);
		pop();
	}
	displayInGameUI(){
		fill((1 - player.healthPerc) * 255, player.healthPerc * 255, 0)
		noStroke()
		rect(15, 565, player.healthPerc * 200, 20, 40)

		noFill()
		stroke(255)
		rect(15, 565, 200, 20, 40)

		fill(0)
		rect(400, 550, 200, 50, 20, 0, 10, 0)

		fill(255)
		textSize(32)
		textAlign(RIGHT)
		text(score, 590, 587)

		noFill()
		rect(0, 0, width, height, 10)
		stroke(255,0,0)

		if (player.healthPerc <= 0){
			game = godMode;
		}
	}

	displayGameOver(){
		if (!menuSong.isPlaying()) {
			gameSong.stop();
			// menuSong.setVolume(0, 5)
			menuSong.play();
		}

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
