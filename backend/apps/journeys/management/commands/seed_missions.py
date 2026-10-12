from django.core.management.base import BaseCommand
from apps.journeys.models import DailyMission

MISSIONS = [
    # Semaine 1 --- Accueillir et retrouver des repères
    {
        "day_number": 1,
        "theme": "reperes",
        "title": "Faire le point sur ce que je ressens aujourd'hui",
        "introduction": "Le début d'une nouvelle étape commence simplement par reconnaître où vous en êtes, sans filtre ni faux semblant.",
        "reflection_prompt": "Quelles sont les trois émotions principales présentes en moi à cet instant ?",
        "exercise": "Prenez 3 minutes pour respirer calmement et écrivez sans retenue ce qui vous traverse l'esprit.",
        "main_action": "Écrire quelques phrases dans votre journal pour nommer votre ressenti actuel.",
        "gentle_version": "Posez une main sur votre poitrine, fermez les yeux et respirez profondément 5 fois. C'est déjà suffisant."
    },
    {
        "day_number": 2,
        "theme": "reperes",
        "title": "Identifier les moments les plus délicats",
        "introduction": "Certaines heures de la journée sont plus sensibles : le réveil, la fin d'après-midi, ou le moment de se coucher.",
        "reflection_prompt": "À quel moment de la journée le manque ou la baisse d'énergie se fait-il le plus ressentir ?",
        "exercise": "Observez votre routine sans jugement pour repérer les créneaux où vous avez besoin de douceur.",
        "main_action": "Planifiez une action réconfortante (une tisane, écouter un podcast, marcher) pour ce moment précis.",
        "gentle_version": "Identifiez simplement un créneau difficile et autorisez-vous à ralentir à cette heure-là."
    },
    {
        "day_number": 3,
        "theme": "reperes",
        "title": "Écrire ce dont j'ai besoin pour me sentir soutenu",
        "introduction": "Exprimer ses besoins à soi-même est la première étape pour pouvoir les accueillir ou les communiquer.",
        "reflection_prompt": "De quoi ai-je le plus besoin en ce moment ? (silence, écoute, repos, présence, sécurité)",
        "exercise": "Listez trois choses tangibles qui vous apportent un sentiment de réconfort immédiat.",
        "main_action": "Accordez-vous au moins un de ces éléments de confort aujourd'hui.",
        "gentle_version": "Offrez-vous un moment de chaleur : un plaid, une boisson chaude ou un bain tiède."
    },
    {
        "day_number": 4,
        "theme": "reperes",
        "title": "Repérer les déclencheurs de souvenirs",
        "introduction": "Un lieu, une chanson, une notification peuvent raviver la nostalgie. Les identifier permet d'éviter d'être pris au dépourvu.",
        "reflection_prompt": "Quels sont les déclencheurs extérieurs qui ont récemment provoqué une vague de nostalgie ?",
        "exercise": "Notez ces déclencheurs pour les apprivoiser et décider de ceux dont vous pouvez vous éloigner temporairement.",
        "main_action": "Mettez en sourdine une playlist ou rangez un objet qui ravive trop de tristesse.",
        "gentle_version": "Si une vague émotionnelle arrive, rappelez-vous : 'C'est un souvenir, ce n'est pas le présent'."
    },
    {
        "day_number": 5,
        "theme": "reperes",
        "title": "Choisir une petite action de soin personnel",
        "introduction": "Prendre soin de son corps et de son espace immédiat envoie le signal que vous comptez et méritez de l'attention.",
        "reflection_prompt": "Comment puis-je traiter mon corps avec bienveillance aujourd'hui ?",
        "exercise": "Choisissez une action simple : cuisiner un plat sain, aérer la chambre, s'étirer doucement.",
        "main_action": "Réalisez cette action de soin sans vous presser.",
        "gentle_version": "Buvez un grand verre d'eau fraîche et étirez doucement vos épaules."
    },
    {
        "day_number": 6,
        "theme": "reperes",
        "title": "Créer ou entretenir un lien social",
        "introduction": "L'isolement amplifie le sentiment de vide. Partager un échange simple, même court, reconnecte au monde extérieur.",
        "reflection_prompt": "Qui dans mon entourage m'apporte une énergie saine et sans jugement ?",
        "exercise": "Pensez à un proche, un collègue bienveillant ou un ami que vous appréciez.",
        "main_action": "Envoyez un message amical ou partagez un café rapide sans obligation de parler de vos difficultés.",
        "gentle_version": "Souriez à un commerçant ou échangez quelques mots polis avec un passant."
    },
    {
        "day_number": 7,
        "theme": "reperes",
        "title": "Faire un premier bilan sans me juger",
        "introduction": "Une semaine s'est écoulée. Qu'elle ait été facile ou traversée d'orages, vous avez fait face avec courage.",
        "reflection_prompt": "Qu'ai-je réussi à traverser cette semaine, même avec des moments de doute ?",
        "exercise": "Relisez vos quelques notes et observez vos efforts sans exiger la perfection.",
        "main_action": "Formulez une phrase d'encouragement sincère envers vous-même.",
        "gentle_version": "Dites-vous simplement : 'J'ai tenu une semaine de plus, pas à pas'."
    },

    # Semaine 2 --- Reconstruire l'estime personnelle
    {
        "day_number": 8,
        "theme": "estime",
        "title": "Identifier une pensée négative récurrente",
        "introduction": "La rupture génère souvent des critiques intérieures sévères. Les repérer est la première étape pour s'en libérer.",
        "reflection_prompt": "Quelle phrase dure me dis-je souvent à propos de moi-même ces derniers temps ?",
        "exercise": "Écrivez cette pensée sur papier pour la regarder comme un simple phénomène mental passager.",
        "main_action": "Rédigez une réponse compatissante comme vous le feriez pour un ami très cher.",
        "gentle_version": "Rappelez-vous : vos pensées ne sont pas des vérités absolues."
    },
    {
        "day_number": 9,
        "theme": "estime",
        "title": "Distinguer un fait d'une interprétation douloureuse",
        "introduction": "Le fait est ce qui s'est passé ; l'interprétation est l'histoire douloureuse que notre mental tisse autour.",
        "reflection_prompt": "Qu'est-ce qui relève du fait objectif et qu'est-ce qui relève de ma propre interprétation ?",
        "exercise": "Séparez sur deux colonnes les faits réels et vos suppositions personnelles.",
        "main_action": "Remplacez une interprétation dévalorisante par une observation neutre.",
        "gentle_version": "Respirez et retenez uniquement ce qui est certain, laissez le reste flotter."
    },
    {
        "day_number": 10,
        "theme": "estime",
        "title": "Noter trois qualités ou forces personnelles",
        "introduction": "Votre valeur ne dépend pas du regard ou de la validation d'une personne extérieure.",
        "reflection_prompt": "Quelles sont les qualités qui font de moi une personne digne d'estime et de respect ?",
        "exercise": "Notez au moins 3 qualités profondes (loyauté, curiosité, empathie, résilience, créativité...).",
        "main_action": "Rappelez-vous un moment de votre vie où l'une de ces qualités a brillé.",
        "gentle_version": "Nommez une seule chose que vous appréciez chez vous aujourd'hui."
    },
    {
        "day_number": 11,
        "theme": "estime",
        "title": "Se rappeler une difficulté déjà surmontée",
        "introduction": "Vous avez déjà traversé des épreuves par le passé, et vous en êtes ressorti grandi.",
        "reflection_prompt": "Quelle épreuve passée pensais-je insurmontable à l'époque ?",
        "exercise": "Remémorez-vous les ressources intérieures qui vous ont permis d'avancer alors.",
        "main_action": "Écrivez une phrase pour honorer votre capacité de résilience.",
        "gentle_version": "Dites-vous : 'J'ai déjà su guérir et avancer. Je le ferai encore'."
    },
    {
        "day_number": 12,
        "theme": "estime",
        "title": "Accomplir une tâche qui procure de la satisfaction",
        "introduction": "Chaque petite victoire concrète restaure le sentiment de compétence et d'efficacité personnelle.",
        "reflection_prompt": "Quelle petite tâche laissée de côté me soulagerait si elle était accomplie ?",
        "exercise": "Choisissez une tâche de 10 à 15 minutes (ranger un tiroir, trier des papiers, faire une démarche).",
        "main_action": "Accomplissez-la et savourez la sensation d'ordre et de clarté qu'elle apporte.",
        "gentle_version": "Rangez un seul objet à sa place. C'est un pas en avant."
    },
    {
        "day_number": 13,
        "theme": "estime",
        "title": "Identifier mes besoins et mes limites",
        "introduction": "Se reconstruire, c'est aussi clarifier ce que l'on accepte et ce que l'on ne souhaite plus tolérer.",
        "reflection_prompt": "Quelles sont les limites saines indispensables à mon équilibre relationnel ?",
        "exercise": "Notez deux limites fondamentales pour vos futures interactions avec les autres.",
        "main_action": "Pratiquez le fait de dire 'non' poliment à une sollicitation non urgente aujourd'hui.",
        "gentle_version": "Respectez votre besoin de calme si quelqu'un vous sollicite excessivement."
    },
    {
        "day_number": 14,
        "theme": "estime",
        "title": "Ce que je souhaite apprendre sur moi",
        "introduction": "Cette transition est une opportunité de mieux vous connaître et de vous choisir.",
        "reflection_prompt": "Quelle facette de ma personnalité ai-je envie d'explorer davantage ?",
        "exercise": "Prenez un moment pour réfléchir à vos aspirations intimes et vos curiosités.",
        "main_action": "Posez une intention pour la semaine à venir qui vous concerne uniquement vous.",
        "gentle_version": "Félicitez-vous d'avoir complété deux semaines de cheminement."
    },

    # Semaine 3 --- Vivre avec les souvenirs
    {
        "day_number": 15,
        "theme": "souvenirs",
        "title": "Écrire ce qui me manque réellement",
        "introduction": "Parfois, ce qui nous manque n'est pas tant la personne que le sentiment d'être entouré ou la routine.",
        "reflection_prompt": "Est-ce la personne réelle qui me manque, ou l'idée de la relation et des habitudes ?",
        "exercise": "Distinguez l'attachement aux souvenirs idéalisés et la réalité du quotidien.",
        "main_action": "Écrivez en toute sincérité ce manque pour lui permettre d'exister sans l'enfouir.",
        "gentle_version": "Reconnaissez le manque comme une émotion normale qui finira par s'apaiser."
    },
    {
        "day_number": 16,
        "theme": "souvenirs",
        "title": "Reconnaître qu'une relation ne définit pas tout",
        "introduction": "Une relation peut avoir été belle et signifiante sans pour autant résumer toute votre histoire de vie.",
        "reflection_prompt": "Quelles parties de mon identité existaient avant cette relation et existent toujours ?",
        "exercise": "Rappelez-vous qui vous étiez, vos passions, vos amitiés indépendantes de ce couple.",
        "main_action": "Revisitez une passion ou un intérêt qui vous appartient en propre.",
        "gentle_version": "Vous êtes une personne complète à vous tout seul."
    },
    {
        "day_number": 17,
        "theme": "souvenirs",
        "title": "Préparer une réponse douce face aux déclencheurs",
        "introduction": "Quand une nostalgie soudaine frappe, avoir un plan de secours prévient la panique ou les impulsions.",
        "reflection_prompt": "Que puis-je faire immédiatement la prochaine fois que j'aurai envie d'écrire ou de regarder des photos ?",
        "exercise": "Définissez une action de substitution saine : poser le téléphone, marcher dehors, écouter un morceau apaisant.",
        "main_action": "Enregistrez cette stratégie dans le mode de soutien de l'application.",
        "gentle_version": "Éloignez votre téléphone de votre vue pendant 20 minutes."
    },
    {
        "day_number": 18,
        "theme": "souvenirs",
        "title": "Écrire une lettre que l'on n'enverra pas",
        "introduction": "Mettre des mots sur les non-dits, les colères ou les regrets permet d'extérioriser sans risque d'escalade.",
        "reflection_prompt": "Que voudrais-je dire pour vider mon sac sans chercher de réponse en retour ?",
        "exercise": "Rédigez cette lettre en toute liberté dans un espace privé, en sachant qu'elle ne sera jamais expédiée.",
        "main_action": "Écrivez cette lettre dans l'outil de lettre privée de l'application.",
        "gentle_version": "Écrivez juste trois phrases brutes sur votre ressenti, puis fermez la page."
    },
    {
        "day_number": 19,
        "theme": "souvenirs",
        "title": "Choisir une activité ancrée dans le présent",
        "introduction": "Les souvenirs vivent dans le passé. Le corps et les sens vivent toujours au présent.",
        "reflection_prompt": "Quelle activité manuelle, physique ou sensorielle me ramène dans l'ici et maintenant ?",
        "exercise": "Focalisez toute votre attention sur une sensation : le contact de vos pieds sur le sol, les odeurs, les sons.",
        "main_action": "Pratiquez 15 minutes d'une activité manuelle ou une marche attentive.",
        "gentle_version": "Fermez les yeux et écoutez attentivement les bruits ambiants pendant 2 minutes."
    },
    {
        "day_number": 20,
        "theme": "souvenirs",
        "title": "Laisser exister les souvenirs sans les traquer",
        "introduction": "Chercher à tout prix à oublier produit l'effet inverse. Accueillir le souvenir sans s'y accrocher libère l'esprit.",
        "reflection_prompt": "Puis-je regarder passer ce souvenir comme un nuage dans le ciel, sans courir après ?",
        "exercise": "Visualisez le souvenir qui passe et s'éloigne lentement sans que vous ayez besoin d'intervenir.",
        "main_action": "Pratiquez le lâcher-prise en ne relisant pas d'anciens messages aujourd'hui.",
        "gentle_version": "Soufflez doucement en visualisant la tension qui quitte vos épaules."
    },
    {
        "day_number": 21,
        "theme": "souvenirs",
        "title": "Faire le point sur les situations aidantes",
        "introduction": "Après trois semaines, vous commencez à repérer ce qui vous allège et ce qui vous alourdit.",
        "reflection_prompt": "Quels sont les contextes ou les personnes qui m'ont réellement aidé à me sentir mieux ?",
        "exercise": "Notez les 3 habitudes qui ont eu un impact positif mesurable sur votre clarté d'esprit.",
        "main_action": "Renforcez la présence de l'une de ces habitudes dans votre quotidien.",
        "gentle_version": "Prenez note d'un moment agréable vécu ces derniers jours."
    },

    # Semaine 4 --- Réinvestir l'avenir
    {
        "day_number": 22,
        "theme": "avenir",
        "title": "Noter ce que j'aimerais retrouver dans ma vie",
        "introduction": "La joie, la légèreté, les rires et la sérénité sont des états qui vous appartiennent et qui reviendront.",
        "reflection_prompt": "Quelles sensations ou activités joyeuses ai-je hâte de vivre à nouveau ?",
        "exercise": "Dressez une liste d'envies simples et réalistes pour les mois à venir.",
        "main_action": "Ajoutez un projet ou une envie dans la section 'Mon avenir'.",
        "gentle_version": "Imaginez un matin futur où vous vous réveillerez le cœur complètement léger."
    },
    {
        "day_number": 23,
        "theme": "avenir",
        "title": "Choisir un objectif personnel réaliste",
        "introduction": "Avoir un cap tangible redonne du sens et de l'énergie créatrice.",
        "reflection_prompt": "Quel projet (sportif, créatif, professionnel ou personnel) me tient à cœur ?",
        "exercise": "Formulez un objectif stimulant mais accessible sans pression démesurée.",
        "main_action": "Créez votre premier objectif dans l'application avec une date indicative.",
        "gentle_version": "Pensez simplement à un projet que vous aimeriez explorer un jour."
    },
    {
        "day_number": 24,
        "theme": "avenir",
        "title": "Découper cet objectif en petites actions",
        "introduction": "Les grands changements sont la somme de minuscules gestes répétés avec bienveillance.",
        "reflection_prompt": "Quelle est la toute première micro-action faisable en 5 minutes pour ce projet ?",
        "exercise": "Décomposez votre objectif en 3 ou 4 étapes très simples.",
        "main_action": "Associez au moins 2 actions concrètes à votre objectif.",
        "gentle_version": "Déterminez une seule petite étape facile."
    },
    {
        "day_number": 25,
        "theme": "avenir",
        "title": "Consacrer un moment à un apprentissage",
        "introduction": "Nourrir son intellect et sa curiosité détourne l'esprit des ruminations et ouvre de nouveaux horizons.",
        "reflection_prompt": "Qu'est-ce qui me passionne ou éveille ma curiosité intellectuelle actuellement ?",
        "exercise": "Passez 20 minutes à lire un article, regarder un documentaire ou apprendre un nouveau concept.",
        "main_action": "Notez dans votre journal une idée nouvelle qui vous a inspiré aujourd'hui.",
        "gentle_version": "Écoutez un court podcast ou un morceau de musique que vous ne connaissez pas."
    },
    {
        "day_number": 26,
        "theme": "avenir",
        "title": "Planifier une activité agréable à venir",
        "introduction": "Avoir des rendez-vous plaisants inscrits à l'agenda crée une anticipation positive réconfortante.",
        "reflection_prompt": "Quel moment de plaisir puis-je programmer pour ce week-end ou la semaine prochaine ?",
        "exercise": "Bloquez un créneau dédié dans votre calendrier pour une activité choisie par et pour vous.",
        "main_action": "Validez cette réservation ou cet engagement auprès de vous-même.",
        "gentle_version": "Planifiez simplement une pause café gourmande demain matin."
    },
    {
        "day_number": 27,
        "theme": "avenir",
        "title": "Écrire les valeurs de mes relations futures",
        "introduction": "Toute épreuve permet d'affiner ce que l'on désire profondément pour son épanouissement futur.",
        "reflection_prompt": "Quelles sont les valeurs clés (respect, réciprocité, honnêteté, écoute) non négociables désormais ?",
        "exercise": "Listez vos 3 valeurs fondamentales dans toute relation humaine équilibrée.",
        "main_action": "Notez ces 3 principes directeurs dans votre journal de réflexion.",
        "gentle_version": "Rappelez-vous que vous méritez d'être traité avec un respect inconditionnel."
    },
    {
        "day_number": 28,
        "theme": "avenir",
        "title": "Identifier les habitudes qui m'aident durablement",
        "introduction": "La stabilité émotionnelle s'enracine dans de petites routines quotidiennes protectrices.",
        "reflection_prompt": "Quelles nouvelles habitudes acquises ce mois-ci ont le plus contribué à mon apaisement ?",
        "exercise": "Faites l'inventaire des gestes du quotidien qui vous font du bien et que vous souhaitez conserver.",
        "main_action": "Prenez l'engagement de protéger l'une de ces habitudes au fil du temps.",
        "gentle_version": "Célébrez une bonne habitude que vous avez su maintenir aujourd'hui."
    },
    {
        "day_number": 29,
        "theme": "avenir",
        "title": "Écrire une lettre à soi-même pour l'avenir",
        "introduction": "Vous avez fait preuve d'une force remarquable. Offrez-vous des mots d'amour et de confiance pour les jours futurs.",
        "reflection_prompt": "Que voudrais-je que mon 'moi futur' n'oublie jamais de cette période de transformation ?",
        "exercise": "Écrivez une lettre bienveillante adressée à la personne que vous serez dans 6 mois.",
        "main_action": "Conservez cette lettre dans votre journal personnel.",
        "gentle_version": "Dites-vous simplement : 'Je suis fier de toi et de la route parcourue'."
    },
    {
        "day_number": 30,
        "theme": "avenir",
        "title": "Faire un bilan libre et choisir la prochaine étape",
        "introduction": "Ce premier cycle de 30 jours se termine, mais votre parcours de renaissance continue à votre propre rythme.",
        "reflection_prompt": "Comment mon regard sur moi et sur ma vie a-t-il évolué depuis le Jour 1 ?",
        "exercise": "Prenez un moment pour savourer le chemin parcouru. Il n'y a pas de fin imposée, juste une continuité sereine.",
        "main_action": "Définissez une nouvelle intention libre pour la suite de votre parcours.",
        "gentle_version": "Prenez une profonde inspiration, souriez et remerciez-vous pour votre patience et votre courage."
    }
]


class Command(BaseCommand):
    help = "Initialise les 30 missions guidées du parcours Reborn"

    def handle(self, *args, **options):
        count = 0
        for mission_data in MISSIONS:
            mission, created = DailyMission.objects.update_or_create(
                day_number=mission_data["day_number"],
                defaults=mission_data
            )
            count += 1
        self.stdout.write(self.style.SUCCESS(f"Succès : {count} missions enregistrées dans la base de données."))
