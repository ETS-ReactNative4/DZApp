//general
export const OK = "OK";
export const CANCEL = "Annuleer";
export const BACK = "Terug";

//LoginScreen
export const LOGIN_HEADER = "Gelieve aan te melden";
export const USERNAME = "Gebruikersnaam";
export const PASSWORD = "Wachtwoord";
export const LOGIN = "Aanmelden";
export const FORGOT_PASS = "Wachtwoord vergeten?";

//LoadingScreen
export const LOCAL_LOADING = "Lokale data laden";
export const SERVER_SYNCING = "Synchronisatie met server";
export const SERVER_SYNC_SUCCESS = "Gesynchroniseerd met server";
export const SERVER_SYNC_FAILURE = "Probleem met synchronisatie: offline modus";

//EventScreen
export const EVENT_HEADER = "Kies een productie of evenement";
export const PICK_EVENT = "Kies Productie";
export const PICK_EVENT_IOS_HEADER = "Kies...";
export const FROM_LABEL = "Van: ";
export const TO_LABEL = "Tot: ";
export const SUBSCRIPTIONFEE_LABEL = "Inschrijvingsgeld: ";
export const PICKER_PRODUCTION = "productie";
export const PICKER_EVENT = "evenement";
export const TYPE_LABEL = "Type: ";
export const CHANGE_EVENT = "Wijzig productie";

//OrderScreen
export const ORDER = "Bestellen";
export const PRODUCT_INPUT = "Producten toevoegen";
export const ENTER_QUANTITY = "Voer hoeveelheid in voor";
export const QUANTITY = "Aantal";
export const INVALID_QUANTITY = "Gelieve een geheel getal in te voeren";
export const IS_CUSTOMER_SUBSCRIBED =
  "Is de klant toegelaten tot dit evenement?";
export const EVENT_BALANCE = "Saldo voor evenement:";
export const BIGGER_THAN_MIN_ERROR = min =>
  `Gelieve een waarde >= ${min.toFixed(2)} € in te geven`;
export const TO_PAY = "Te betalen: ";
export const FINISH_ORDER = "Bestelling afronden";
export const CONFIRM_ORDER = "Bevestig bestelling";
export const ORDER_PROCESSED = "Bestelling verwerkt";
export const PAYED_TOTAL_LABEL = "Totaal betaald: ";
export const PREV_SUBSCRIPTION_BALANCE_LABEL = "Vorig saldo voor evenement: ";
export const CURRENT_SUBSCRIPTION_BALANCE_LABEL =
  "Huidig saldo voor evenement: ";
export const PAYED_FROM_CREDIT_LABEL = "Betaald van saldo: ";
export const PAYED_FROM_SUBSCRIPTIONFEE_LABEL =
  "Betaald van inschrijvingsgeld: ";
export const BACK_TO_PRODUCT_INPUT = "Naar bestellen";

//OrderTopupModal
export const INSUFFICIENT_FUNDS_HEADER = "Saldo ontoereikend";
export const INSUFFICIENT_FUNDS_MESSAGE =
  "heeft onvoldoende saldo voor deze bestelling. Saldo opladen?";

//OrderConfirmModal
export const ORDER_CONFIRM_MODAL_HEADER = "Bestelling bevestigen";
export const ORDER_CONFIRM_MODAL_MESSAGE = "afrekenen voor";

//OverviewScreen
export const OVERVIEW = "Overzicht";
export const EVENT = "Productie: ";
export const CASHIER = "Kassier: ";
export const TOTAL = "Totaal: ";
export const CHOOSE_CUSTOMER = "Kies Klant";
export const DETAILS = "Details";
export const SHOW_LIST = "Toon details";
export const HIDE_LIST = "Verberg details";

//TopupScreen
export const TOPUP = "Saldo Opladen";
export const ENTER_TOPUP_AMT = "Bedrag invoeren";
export const CONFIRM_AMT = "Bevestig bedrag";
export const CONFIRM_CUSTOMER = "Bevestig klant";
export const SCAN_CUSTOMER_CARD = "Scan QR code:";
export const CHOOSE_CUSTOMER_FROM_LIST = "Kies een klant uit de lijst";
export const CAM_OPTION = "Scan code";
export const COMBO_OPTION = "Toon lijst";
export const TOPUP_FOR_CUSTOMER = "Opladen voor:";
export const AMOUNT = "Bedrag (€)";
export const AMOUNT_LABEL = "Bedrag:";
export const INVALID_QR = "Ongeldige QR code!";
export const CAM_PERMISSION_TITLE = "DZApp toelaten de camera te gebruiken?";
export const CAM_PERMISSION_MESSAGE =
  "DZApp heeft de camera nodig om klanten te identificeren.";
export const CUSTOMER = "Klant: ";
export const CURRENT_BALANCE = "Huidig saldo:";
export const TOPUP_AMOUNT = "Bedrag:";
export const PICK_OTHER_CUSTOMER = "Kies andere klant";
export const TOPUP_BALANCE = "Saldo opladen";
export const TOPUP_CONFIRM = "Saldo opladen?";
export const TOPUP_FOR = " opladen voor ";
export const INVALID_AMOUNT =
  "Gelieve een bedrag > 0 en <= 100 € in te voeren!";
export const CHANGE_AMOUNT = "Wijzig bedrag";
export const CHANGE_CUSTOMER = "Wijzig klant";
export const CONFIRM = "Bevestig";
export const TOPPED_UP = "Saldo Opgeladen";
export const PREV_BALANCE = "Vorig saldo: ";
export const PICK_CUSTOMER_IOS_HEADER = "Kies...";
export const PICKER_EXTERNAL = "extern";
export const PICKER_MEMBER = "lid";
export const PICKER_CASHIER = "kassier";

//HistoryScreen
export const HISTORY = "Geschiedenis";
export const ORDERS = "Bestellingen";
export const TOPUPS = "Opladingen";

//misc
export const IN_STOCK = "Voorraad:";
export const INSUFFICIENT_STOCK = "Onvoldoende voorraad!";

//Error messages
export const SERVER_TIMEOUT = "Timeout van verbinding met de server";
export const UNABLE_TO_SYNC = "Kon niet synchroniseren met de server";
export const NO_CONNECTION = "Geen netwerkverbinding";

//Success messages
export const SYNCED = "Gesynchroniseerd met server";
export const AUTHENTICATED = "Succesvol aangemeld";

//navigation
export const TO_POS = "Naar bestellen";
export const TO_TOPUP = "Naar opladen";
