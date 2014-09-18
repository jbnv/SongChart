function ArtistService() {

var data = 
[
[ 'a:38-special' , "38 Special" ],
[ 'a:abba' , "ABBA" ],
[ 'a:abc' , "ABC" ],
[ 'a:ac-dc' , "AC/DC" ],
[ 'a:ace-of-base' , "Ace of Base" ],
[ 'a:aerosmith' , "Aerosmith" ],
[ 'a:after-7' , "After 7" ],
[ 'a:alanis-morrisette' , "Alanis Morrisette" ],
[ 'a:alexander-o-neal' , "Alexander O'Neal" ],
[ 'a:all-4-one' , "All 4 One" ],
[ 'a:amy-grant' , "Amy Grant" ],
[ 'a:animotion' , "Animotion" ],
[ 'a:anita-baker' , "Anita Baker" ],
[ 'a:aretha-franklin' , "Aretha Franklin" ],
[ 'a:asia' , "Asia" ],
[ 'a:atlantic-starr' , "Atlantic Starr" ],
[ 'a:b-52s' , "B-52s" ],
[ 'a:bad-company' , "Bad Company" ],
[ 'a:bananarama' , "Bananarama" ],
[ 'a:bangles' , "Bangles" ],
[ 'a:be' , "Be" ],
[ 'a:beatles' , "Beatles" ],
[ 'a:beck' , "Beck" ],
[ 'a:belinda-carlisle' , "Belinda Carlisle" ],
[ 'a:bell-biv-devoe' , "Bell Biv DeVoe" ],
[ 'a:better-than-ezra' , "Better Than Ezra" ],
[ 'a:bi' , "Bi" ],
[ 'a:billy-idol' , "Billy Idol" ],
[ 'a:billy-joel' , "Billy Joel" ],
[ 'a:billy-ocean' , "Billy Ocean" ],
[ 'a:bj-thomas' , "BJ Thomas" ],
[ 'a:bl' , "Bl*" ],
[ 'a:black-box' , "Black Box" ],
[ 'a:blessid-union-of-souls' , "Blessid Union of Souls" ],
[ 'a:blues-traveler' , "Blues Traveler" ],
[ 'a:bo' , "Bo" ],
[ 'a:bobby-brown' , "Bobby Brown" ],
[ 'a:bob-seger' , "Bob Seger" ],
[ 'a:bon-jovi' , "Bon Jovi" ],
[ 'a:bonnie-tyler' , "Bonnie Tyler" ],
[ 'a:boyz-ii-men' , "Boyz II Men" ],
[ 'a:brad-paisley' , "Brad Paisley" ],
[ 'a:breathe' , "Breathe" ],
[ 'a:brother-beyond' , "Brother Beyond" ],
[ 'a:bruce-hornsby-the-range' , "Bruce Hornsby & the Range" ],
[ 'a:bryan-adams' , "Bryan Adams" ],
[ 'a:buster-poindexter' , "Buster Poindexter" ],
[ 'a:c' , "C" ],
[ 'a:cathy-dennis' , "Cathy Dennis" ],
[ 'a:charlie-sexton' , "Charlie Sexton" ],
[ 'a:cher' , "Cher" ],
[ 'a:christina-aguillera' , "Christina Aguillera" ],
[ 'a:chumbawumba' , "Chumbawumba" ],
[ 'a:cliff-richard' , "Cliff Richard" ],
[ 'a:club-nouveau' , "Club Nouveau" ],
[ 'a:coolio' , "Coolio" ],
[ 'a:crash-test-dummies' , "Crash Test Dummies" ],
[ 'a:creedence-clearwater-revival' , "Creedence Clearwater Revival" ],
[ 'a:culture-club' , "Culture Club" ],
[ 'a:cyndi-lauper' , "Cyndi Lauper" ],
[ 'a:d' , "D" ],
[ 'a:da' , "Da*" ],
[ 'a:dan-hill' , "Dan Hill" ],
[ 'a:dan-hill-with-vonda-sheppard' , "Dan Hill with Vonda Sheppard" ],
[ 'a:danny-wilson' , "Danny Wilson" ],
[ 'a:dave-matthews-band' , "Dave Matthews Band" ],
[ 'a:david-bowie' , "David Bowie" ],
[ 'a:david-lee-roth' , "David Lee Roth" ],
[ 'a:dazz-band' , "Dazz Band" ],
[ 'a:debbie-gibson' , "Debbie Gibson" ],
[ 'a:def-leppard' , "Def Leppard" ],
[ 'a:deniece-williams' , "Deniece Williams" ],
[ 'a:depeche-mode' , "Depeche Mode" ],
[ 'a:destiny-s-child' , "Destiny's Child" ],
[ 'a:di' , "Di*" ],
[ 'a:diane-king' , "Diane King" ],
[ 'a:dino' , "Dino" ],
[ 'a:dionne-farris' , "Dionne Farris" ],
[ 'a:dionne-warwick-jeffrey-osborne' , "Dionne Warwick & Jeffrey Osborne" ],
[ 'a:donald-fagen' , "Donald Fagen" ],
[ 'a:don-henley' , "Don Henley" ],
[ 'a:don-johnson' , "Don Johnson" ],
[ 'a:donna-lewis' , "Donna Lewis" ],
[ 'a:dr-hook' , "Dr. Hook" ],
[ 'a:duran-duran' , "Duran Duran" ],
[ 'a:e' , "E" ],
[ 'a:eagles' , "Eagles" ],
[ 'a:ed' , "Ed*" ],
[ 'a:eddie-money' , "Eddie Money" ],
[ 'a:eddie-rabbitt' , "Eddie Rabbitt" ],
[ 'a:elton-john' , "Elton John" ],
[ 'a:elvis-costello' , "Elvis Costello" ],
[ 'a:elvis-presley' , "Elvis Presley" ],
[ 'a:en-vogue' , "En Vogue" ],
[ 'a:eurythmics' , "Eurythmics" ],
[ 'a:expose' , "Expose" ],
[ 'a:extreme' , "Extreme" ],
[ 'a:f' , "F" ],
[ 'a:faith-no-more' , "Faith No More" ],
[ 'a:fat-boys-beach-boys' , "Fat Boys & Beach Boys" ],
[ 'a:fine-young-cannibals' , "Fine Young Cannibals" ],
[ 'a:fleetwood-mac' , "Fleetwood Mac" ],
[ 'a:foreigner' , "Foreigner" ],
[ 'a:frida' , "Frida" ],
[ 'a:fun-factory' , "Fun Factory" ],
[ 'a:g' , "G" ],
[ 'a:genesis' , "Genesis" ],
[ 'a:george' , "George*" ],
[ 'a:george-benson' , "George Benson" ],
[ 'a:george-michael' , "George Michael" ],
[ 'a:george-thurogood-the-destroyers' , "George Thurogood & the Destroyers" ],
[ 'a:gino-vannelli' , "Gino Vannelli" ],
[ 'a:glass-tiger' , "Glass Tiger" ],
[ 'a:glenn-frye' , "Glenn Frye" ],
[ 'a:glenn-medeiros' , "Glenn Medeiros" ],
[ 'a:gloria-loring-carl-anderson' , "Gloria Loring & Carl Anderson" ],
[ 'a:gnarls-barkley' , "Gnarls Barkley" ],
[ 'a:go-gos' , "Go-Gos" ],
[ 'a:goo-goo-dolls' , "Goo Goo Dolls" ],
[ 'a:go-west' , "Go West" ],
[ 'a:grateful-dead' , "Grateful Dead" ],
[ 'a:greg-kihn-band' , "Greg Kihn Band" ],
[ 'a:guns-n-roses' , "Guns N Roses" ],
[ 'a:h' , "H" ],
[ 'a:hall-oates' , "Hall & Oates" ],
[ 'a:heart' , "Heart" ],
[ 'a:howard-jones' , "Howard Jones" ],
[ 'a:huey-lewis-the-news' , "Huey Lewis & the News" ],
[ 'a:human-league' , "Human League" ],
[ 'a:i' , "I" ],
[ 'a:icehouse' , "Icehouse" ],
[ 'a:indecent-obsession' , "Indecent Obsession" ],
[ 'a:inxs' , "INXS" ],
[ 'a:j' , "J" ],
[ 'a:jade' , "Jade" ],
[ 'a:james-ingram' , "James Ingram" ],
[ 'a:janet-jackson' , "Janet Jackson" ],
[ 'a:jellybean' , "Jellybean" ],
[ 'a:jeremy-jordan' , "Jeremy Jordan" ],
[ 'a:jody-watley' , "Jody Watley" ],
[ 'a:johnny-gill' , "Johnny Gill" ],
[ 'a:johnny-hates-jazz' , "Johnny Hates Jazz" ],
[ 'a:john-parr' , "John Parr" ],
[ 'a:journey' , "Journey" ],
[ 'a:juice-newton' , "Juice Newton" ],
[ 'a:k' , "K" ],
[ 'a:kajagoogoo' , "Kajagoogoo" ],
[ 'a:karyn-white' , "Karyn White" ],
[ 'a:keith-sweat' , "Keith Sweat" ],
[ 'a:kenny-loggins' , "Kenny Loggins" ],
[ 'a:kenny-rogers' , "Kenny Rogers" ],
[ 'a:kenny-rogers-dolly-parton' , "Kenny Rogers & Dolly Parton" ],
[ 'a:kim-carnes' , "Kim Carnes" ],
[ 'a:klymaxx' , "Klymaxx" ],
[ 'a:kool-the-gang' , "Kool & the Gang" ],
[ 'a:l' , "L" ],
[ 'a:la' , "La*" ],
[ 'a:la-bouche' , "La Bouche" ],
[ 'a:laura-branigan' , "Laura Branigan" ],
[ 'a:levert' , "Levert" ],
[ 'a:li' , "Li*" ],
[ 'a:linda-rondstadt' , "Linda Rondstadt" ],
[ 'a:linda-rondstadt-1' , "Linda Rondstadt" ],
[ 'a:linda-rondstadt-james-ingram' , "Linda Rondstadt / James Ingram" ],
[ 'a:lionel-richie' , "Lionel Richie" ],
[ 'a:lipps-inc' , "Lipps Inc." ],
[ 'a:lisa-lisa-cult-jam' , "Lisa Lisa & Cult Jam" ],
[ 'a:lisa-stansfield' , "Lisa Stansfield" ],
[ 'a:little-river-band' , "Little River Band" ],
[ 'a:living-in-a-box' , "Living in a Box" ],
[ 'a:looking-glass' , "Looking Glass" ],
[ 'a:los-del-rio' , "Los del Rio" ],
[ 'a:los-lobos' , "Los Lobos" ],
[ 'a:loverboy' , "Loverboy" ],
[ 'a:luther-vandross' , "Luther Vandross" ],
[ 'a:m' , "M" ],
[ 'a:ma' , "Ma*" ],
[ 'a:madonna' , "Madonna" ],
[ 'a:mariah-carey' , "Mariah Carey" ],
[ 'a:mariah-carey-boyz-ii-men' , "Mariah Carey & Boyz II Men" ],
[ 'a:maxie-priest' , "Maxie Priest" ],
[ 'a:mc-hammer' , "MC Hammer" ],
[ 'a:men-at-work' , "Men at Work" ],
[ 'a:mi' , "Mi*" ],
[ 'a:miami-sound-machine' , "Miami Sound Machine" ],
[ 'a:michael-buble' , "Michael Buble" ],
[ 'a:michael-jackson' , "Michael Jackson" ],
[ 'a:michael-mcdonald' , "Michael McDonald" ],
[ 'a:michael-sembello' , "Michael Sembello" ],
[ 'a:milli-vanilli' , "Milli Vanilli" ],
[ 'a:mister-mister' , "Mister Mister" ],
[ 'a:mo' , "Mo*" ],
[ 'a:monica' , "Monica" ],
[ 'a:monkees' , "Monkees" ],
[ 'a:montell-jordan' , "Montell Jordan" ],
[ 'a:n' , "N" ],
[ 'a:natalie-cole' , "Natalie Cole" ],
[ 'a:neil-sedaka' , "Neil Sedaka" ],
[ 'a:new-edition' , "New Edition" ],
[ 'a:new-kids-on-the-block' , "New Kids on the Block" ],
[ 'a:nikki-french' , "Nikki French" ],
[ 'a:nylons' , "Nylons" ],
[ 'a:o' , "o" ],
[ 'a:oak-ridge-boys' , "Oak Ridge Boys" ],
[ 'a:oingo-boingo' , "Oingo Boingo" ],
[ 'a:olivia-newton-john' , "Olivia Newton-John" ],
[ 'a:oran-juice-jones' , "Oran \"Juice\" Jones" ],
[ 'a:owl-city' , "Owl City" ],
[ 'a:p' , "P" ],
[ 'a:patti-austin' , "Patti Austin" ],
[ 'a:patti-austin-james-ingram' , "Patti Austin & James Ingram" ],
[ 'a:patty-smythe' , "Patty Smythe" ],
[ 'a:patty-smythe-don-henley' , "Patty Smythe & Don Henley" ],
[ 'a:paul' , "Paul*" ],
[ 'a:paula-abdul' , "Paula Abdul" ],
[ 'a:paul-anka' , "Paul Anka" ],
[ 'a:paul-davis' , "Paul Davis" ],
[ 'a:paul-mccartney' , "Paul McCartney" ],
[ 'a:paul-mccartney-f-michael-jackson' , "Paul McCartney f. Michael Jackson" ],
[ 'a:paul-mccartney-stevie-wonder' , "Paul McCartney & Stevie Wonder" ],
[ 'a:paul-young' , "Paul Young" ],
[ 'a:pearl-jam' , "Pearl Jam" ],
[ 'a:pebbles' , "Pebbles" ],
[ 'a:peter-gabriel' , "Peter Gabriel" ],
[ 'a:pete-townsend' , "Pete Townsend" ],
[ 'a:pet-shop-boys' , "Pet Shop Boys" ],
[ 'a:phil-collins' , "Phil Collins" ],
[ 'a:po' , "Po*" ],
[ 'a:poco' , "Poco" ],
[ 'a:pointer-sisters' , "Pointer Sisters" ],
[ 'a:police' , "Police" ],
[ 'a:power-station' , "Power Station" ],
[ 'a:prince' , "Prince" ],
[ 'a:pseudo-echo' , "Pseudo Echo" ],
[ 'a:q' , "Q" ],
[ 'a:queen' , "Queen" ],
[ 'a:r' , "R" ],
[ 'a:real-mccoy' , "Real McCoy" ],
[ 'a:regina' , "Regina" ],
[ 'a:reo-speedwagon' , "REO Speedwagon" ],
[ 'a:richard-marx' , "Richard Marx" ],
[ 'a:righteous-brothers' , "Righteous Brothers" ],
[ 'a:rita-coolidge' , "Rita Coolidge" ],
[ 'a:ro' , "Ro*" ],
[ 'a:robbie-nevil' , "Robbie Nevil" ],
[ 'a:roberta-flack' , "Roberta Flack" ],
[ 'a:roberta-flack-peabo-bryson' , "Roberta Flack & Peabo Bryson" ],
[ 'a:robert-palmer' , "Robert Palmer" ],
[ 'a:robert-plant' , "Robert Plant" ],
[ 'a:rob-thomas' , "Rob Thomas" ],
[ 'a:rolling-stones' , "Rolling Stones" ],
[ 'a:ronnie-milsap' , "Ronnie Milsap" ],
[ 'a:roxette' , "Roxette" ],
[ 'a:run-dmc' , "Run-DMC" ],
[ 'a:rupert-holmes' , "Rupert Holmes" ],
[ 'a:sade' , "Sade" ],
[ 'a:samantha-fox' , "Samantha Fox" ],
[ 'a:santana' , "Santana" ],
[ 'a:santana-f-rob-thomas' , "Santana f. Rob Thomas" ],
[ 'a:scritti-politi' , "Scritti Politi" ],
[ 'a:seal' , "Seal" ],
[ 'a:selena' , "Selena" ],
[ 'a:shalamar' , "Shalamar" ],
[ 'a:shania-twain' , "Shania Twain" ],
[ 'a:shocking-blue' , "Shocking Blue" ],
[ 'a:sinead-o-connor' , "Sinead O'Connor" ],
[ 'a:smokey-robinson' , "Smokey Robinson" ],
[ 'a:snoop-dogg' , "Snoop Dogg" ],
[ 'a:soul-4-real' , "Soul 4 Real" ],
[ 'a:soul-ii-soul' , "Soul II Soul" ],
[ 'a:starship' , "Starship" ],
[ 'a:stephanie-mills' , "Stephanie Mills" ],
[ 'a:stevie-b' , "Stevie B" ],
[ 'a:stevie-wonder' , "Stevie Wonder" ],
[ 'a:sting' , "Sting" ],
[ 'a:stone-temple-pilots' , "Stone Temple Pilots" ],
[ 'a:stray-cats' , "Stray Cats" ],
[ 'a:styx' , "Styx" ],
[ 'a:su' , "Su*" ],
[ 'a:sugar-ray' , "Sugar Ray" ],
[ 'a:supremes' , "Supremes" ],
[ 'a:survivor' , "Survivor" ],
[ 'a:suzanne-vega' , "Suzanne Vega" ],
[ 'a:sweet' , "Sweet" ],
[ 'a:sweet-sensation' , "Sweet Sensation" ],
[ 'a:swv' , "SWV" ],
[ 'a:t' , "T" ],
[ 'a:ta' , "Ta*" ],
[ 'a:take-that' , "Take That" ],
[ 'a:taylor-dayne' , "Taylor Dayne" ],
[ 'a:tears-for-fears' , "Tears for Fears" ],
[ 'a:technotronic' , "Technotronic" ],
[ 'a:terrence-trent-d-arby' , "Terrence Trent D'Arby" ],
[ 'a:the-cars' , "The Cars" ],
[ 'a:the-deele' , "The Deele" ],
[ 'a:the-system' , "The System" ],
[ 'a:the-time' , "The Time" ],
[ 'a:third-eye-blind' , "Third Eye Blind" ],
[ 'a:times-two' , "Times Two" ],
[ 'a:timex-social-club' , "Timex Social Club" ],
[ 'a:tina-turner' , "Tina Turner" ],
[ 'a:tlc' , "TLC" ],
[ 'a:to' , "To*" ],
[ 'a:toad-the-wet-sprocket' , "Toad the Wet Sprocket" ],
[ 'a:tom-cochrane' , "Tom Cochrane" ],
[ 'a:tone-loc' , "Tone-Loc" ],
[ 'a:toni-basil' , "Toni Basil" ],
[ 'a:toto' , "Toto" ],
[ 'a:t-pau' , "T'pau" ],
[ 'a:tracie-spencer' , "Tracie Spencer" ],
[ 'a:u2' , "U2" ],
[ 'a:vanessa-williams' , "Vanessa Williams" ],
[ 'a:van-halen' , "Van Halen" ],
[ 'a:village-people' , "Village People" ],
[ 'a:wang-chung' , "Wang Chung" ],
[ 'a:was-not-was' , "Was (Not Was)" ],
[ 'a:whispers' , "Whispers" ],
[ 'a:white-lion' , "White Lion" ],
[ 'a:whitesnake' , "Whitesnake" ],
[ 'a:whitney-houston' , "Whitney Houston" ],
[ 'a:willie-nelson' , "Willie Nelson" ],
[ 'a:yes' , "Yes" ],
]

	var data1 = {};
	for (var index in data) {
		data1[data[index][0]] = data[index];
	}
	
	this.getArtist = function(id) {
		entry = data1[id];
		return {
			name: entry[1]
		};
	}

}
