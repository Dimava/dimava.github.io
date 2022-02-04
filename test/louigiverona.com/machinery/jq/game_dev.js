
  var version="0.99";

  //PLAYER (includes parameters which are reset after prestige)
  var money=0;
  var charge=0;
  var total_money=0;//total money generated within the prestige cycle
  var antimatter=0;//prestige currency during the session

  var night_shift=0;//not set in Init(), changed through prestige
  var chief=0;//whether you are chief engineer or not, which happens as soon as you build the space station for the first time

  //research lab
  var actions_cycle=0;//generator actions per cycle (currently unused)
  var bonus_multiplier;//part of moneyCalc() formula
  var bonus_amount;//percentage of effectiveness
  var researchList;//contains the actual upgrades

  //status
  var magicnumber=0;

  //moneyCalc multipliers (ones that are always part of the moneyCalc formula)
  var magnetron_multiplier;

  //PRESTIGE (most items here are not reset after prestige)
  //these are set up here, outside of Init(), because they are consistent across prestige cycles
  var prevAntimatterCost=0;
  var nextAntimatterCost=0;//how much energy needs to be generated till next antimatter particle is awarded;
  var all_time_antimatter=0;//works across cycles and is used in the antimatter formula, but says nothing regarding how much antimatter cubes you own, since depends on all_time_money only
  var antimatter_cubes=0;//this is the currency that antimatter is converted into; it says how much all_time_antimatter has been actually converted through warping into cubes
  var antimatter_cubes_spent=0;//how much antimatter cubes was spent
  var all_time_money=0;//total money generated - across cycles
    var prestige_multiplier=1;//this is the upgrade that increases the efficiency of the generators (amplifier)
    var money_limit_init=50;//this will depend on the prestige multiplier, so that people start with a larger power limit, so as not to click repeatedly
    var money_limit_upgrade_price_init=10;

    //PRESTIGE PRICES
    var warp_magnetron_alerting_upgrade_price;
    var warp_magnetron_duration_upgrade_price;
    var warp_magnetron_multiplier_upgrade_price;
    var warp_rank1_upgrade_price;
    var warp_rank2_upgrade_price;
    var warp_rank3_upgrade_price;
    var warp_rank4_upgrade_price;
    var warp_wallpaper_upgrade_price;
    var warp_magicnumber_upgrade_price;
    var warp_magicnumber_upgrade_flag=0;
    var warp_amplifier_upgrade_price;
    var warp_amplifier_upgrade_flag=0;
    var warp_maintenance_upgrade_price=Math.pow(10,7);

    //PRESTIGE SPECIAL VARIABLES
    var warp_max_magnetron_duration=60;//default max magnetron duration; later upgraded to 120
    var warp_max_magnetron_multiplier=10;//default max magnetron multiplier; later upgraded to 20
    var warp_magnetron_alerting=0;//default value, later upgraded to 1

  //UPGRADES
  var money_limit;
  var one_supply;
  var two_supply;
  var three_supply;
  var four_supply;
  var one_generation;
  var two_generation;
  var three_generation;
  var four_generation;

  var actions;
  var actions_limit=100;//setting here, because it's not set in Init(); later it can be reset through prestige

  //UPGRADE PBs + UPGRADE MULTIPLIER LEVELS
  var one_upgrade_supply_limit_stage;
  var one_upgrade_effectiveness_stage;
  var one_upgrade_effectiveness_level;

  var two_upgrade_supply_limit_stage;
  var two_upgrade_effectiveness_stage;
  var two_upgrade_effectiveness_level;

  var three_upgrade_supply_limit_stage;
  var three_upgrade_effectiveness_stage;
  var three_upgrade_effectiveness_level;

  var four_upgrade_supply_limit_stage;
  var four_upgrade_effectiveness_stage;
  var four_upgrade_effectiveness_level;

  //PRICES
  var one_upgrade_supply_limit_price;
  var one_upgrade_effectiveness_price;
  var one_upgrade_generation_price;

  var two_upgrade_supply_limit_price;
  var two_upgrade_effectiveness_price;
  var two_upgrade_generation_price;

  var three_upgrade_supply_limit_price;
  var three_upgrade_effectiveness_price;
  var three_upgrade_generation_price;

  var four_upgrade_supply_limit_price;
  var four_upgrade_effectiveness_price;
  var four_upgrade_generation_price;

  var money_limit_upgrade_price;

  var sgr=0.2;//supply growth rate
  var egr=0.25;//effectiveness growth rate - the rate at which generator effectiveness (power) prices grow

  //LOOPS
  var one_interval;
  var two_interval;
  var three_interval;
  var four_interval;
  var save_timer;
  var telescope_timer;
  var furnace_cooling_timer;
  var magnetron_interval;

  //PRICES
  var one_price;//this is the supply limit for each generator. the naming is very confusing, for which I apologize, mostly to my future self, I guess
  var two_price;
  var three_price;
  var four_price;

  //MULTIPLIERS (effectiveness)
  var one_multiplier;
  var two_multiplier;
  var three_multiplier;
  var four_multiplier;

  var one_init_multiplier;//these are used to automatically generate prices for generator generations
  var two_init_multiplier;
  var three_init_multiplier;
  var four_init_multiplier;

  //PB ratio variables
  var one_recent_money;//this is used to understand each generator's contribution
  var two_recent_money;
  var three_recent_money;
  var four_recent_money;

  //battery charges per generator
  var one_charge=0;
  var two_charge=0;
  var three_charge=0;
  var four_charge=0;

  //MACHINES
  //machine states
  var battery_state=0;//0 - locked, 1- unlocked
  var magnetron_state=0;
  var foundry_state=0;
  var engden_state=0;//this is not set in Init() and can be changed with prestige; this defines if you are at least rank1
  var lscanner_state=0;//same as above, defines rank2
  var shuttlebay_state=0;
  var mc_state=0;
  var station_state=0;
  var telescope_state=0;
    //BATTERY
    var charge=0;
    var charge_limit=50;
    var charge_limit_upgrade_price;
    var battery_unlock_upgrade_price;
    var battery_charge_percentage=0;
    var battery_charge_percentage_limit=1;
    var charge_throughput_upgrade_price;
    var charge_throughput_magicnumber_flag=0;
    //MAGNETRON
    var magnetron_unlock_upgrade_price;
    var device_magnetron_multiplier;//this holds the value of the multipler in the magnetron. magnetron_multiplier is only set to device_magnetron_multiplier for a limited duration
    var magnetron_duration;
    var magnetron_multiplier_upgrade_price;
    var magnetron_duration_upgrade_price;
    var magnetron_probability_max;//how likely is the magnetron to be armed
    //engden
    var auxiliary_effectiveness;
    var auxiliary_effectiveness1;//for different levers. the final auxiliary_effectiveness is comprised of the two
    var auxiliary_effectiveness2;
    var auxiliary_probability_max=50;//how fast couplings get misaligned
    //lifeforms scanner
    var lifeforms_collection=[0,0,0,0,0,0,0,0];
    var animal1_bonus_multiplier=0;//this is 0, because it is being added to bonus_multiplier in moneyCalc()
    var animal2_magnetron_duration=0;//this is being added
    var animal3_magnetron_multiplier=0;//this is being added
    var animal4_supply_price_reduction=1;//this is being multiplied
    var animal5_auxiliary_probability_modifier=0;//this is being added
    var animal6_components_multiplier=1;//this is being multiplied
    var animal7_battery_charge_multiplier=1;//this is being multiplied
    var animal8_magicnumber_flag=0;//this is the only variable that is being saved, since it's a flag
    var recency=0;//whether the player rebooted recently or not, which affects how frequently they encounter lifeforms
    //foundry
    var foundry_components;//components
    var foundry_unlock_upgrade_price;
    var foundry_heating_stage;//0-3; cycling through this variable heats up the furnace
    var foundry_temperature;
    var foundry_components_cycle_upgrade_price;
    var foundry_components_multiplier;//how many components produced per cycle
    var foundry_production_flag;//whether the foundry is in production mode or not
    var fccu_stage;//handling the foundry progress bar
    var fccu_level;//handling the foundry progress bar
    //shuttlebay
    var shuttlebay_unlock_upgrade_price;
    var build_shuttle_upgrade_price;
    var shuttle_capacity_upgrade_price;
    var repair_shuttle_upgrade_price;
    var shuttle_fleet={//this needs to be initiated here, since factoryState() checks for it
          availability:['0','0','0','0','0'],
        };
    var bsu_stage;
    var rsu_stage;
    var repair_shuttle_flag=0;
    var shuttle_capacity;
    var shuttle_capacity_magicnumber_flag=0;
    //mc
    var mission_debris_launch_flag;
    var mission_debris_amount;
    var mission_debris_stage;
      var mission_station_launch_flag;
      var mission_station_status;
      var mission_station_upgrade_price;
      var mission_station_stage;
    var mission_telescope_launch_flag;
    var mission_telescope_status;
    var mission_telescope_upgrade_price;
    var mission_telescope_stage;
    //telescope
    var telescope_seconds_amount;
    var telescope_stars_amount;
    var telescope_galaxies_amount;
    var telescope_stars_amount_limit;
    var telescope_resolution_upgrade_price;
    var telescope_resolution;//the maximum amount of stars discoverable in one cycle
    var telescope_magicnumber_flag=0;//this is set here, as this is outside init functions




  //UI
  var audio_volume=0.5;
  var audio_mute=0;
    var audio_mute_one=0;
    var audio_mute_two=0;
    var audio_mute_three=0;
    var audio_mute_four=0;
    var audio_mute_allgen=0;
    var audio_tick2;
    var audio_click4;
    var audio_click5;
    var audio_pbtick;
    var audio_bonus;
    var audio_initiated=0;
  var save_sec=60;
  var pb_one_width;
  var pb_money_width;
  var pb_battery_width;
  var pb_antimatter_width;
  var pb_supply_limit_width;
  var stats_window_flag=0;//whether stats window is open or not
  var prestige_window_flag=0;
  var reset_window_flag=0;
  var settings_window_flag=0;
  var bonusbox_window_flag=0;
  var rankinfo_window_flag=0;
  var debug=0;
  var one_x=0;
  var two_x=0;
  var three_x=0;
  var four_x=0;
  var telescope_list=[];
  var last_animal=999;
  var last_animal_id;

  //OPTIMIZATIONS
  //to only check buttons on the open tab
  var active_tab_flag=1;
  //to only calculate ratios when effectiveness changes
  var one_ratios_flag;
  var two_ratios_flag;
  var three_ratios_flag;
  var four_ratios_flag;

  //CACHE

  //PRESTIGE CACHE
  var warp_rank1_upgrade;
  var warp_rank2_upgrade;
  var warp_rank3_upgrade;
  var warp_rank4_upgrade;
  var warp_wallpaper_upgrade;
  var warp_amplifier_upgrade;
  var warp_magicnumber_upgrade;
  var warp_maintenance_upgrade;
  var warp_magnetron_alerting_upgrade;
  var warp_magnetron_duration_upgrade;
  var warp_magnetron_multiplier_upgrade;

  //MACHINES CACHE
  var pb_battery;
  var pb_battery_indicator;
  var charge_limit_upgrade;
  var charge_limit_label;
  var battery_block;
  var battery_lock_block;
  var battery_unlock_upgrade;
  var battery_percent_up;
  var battery_percent_down;
  var battery_charge_percentage_label;
  var battery_effectiveness_label;
  var charge_throughput_label;
  var charge_throughput_upgrade;

  var magnetron_lock_block;
  var magnetron_block;
  var magnetron_button;
  var magnetron_unlock_upgrade;
  var magnetron_multiplier_label;
  var magnetron_duration_label;
  var magnetron_duration_upgrade;
  var magnetron_multiplier_upgrade;

  var mc_lock_block;
  var mc_block;
  var mc_unlock_upgrade;

  var foundry_lock_block;
  var foundry_block;
  var foundry_unlock_upgrade;

  var shuttlebay_lock_block;
  var shuttlebay_block;
  var shuttlebay_unlock_upgrade;

  var battery_info_box;
  var battery_info_close;
  var battery_info;

  var magnetron_info_box;
  var magnetron_info_close;
  var magnetron_info;

  var auxiliary_lever1;
  var auxiliary_lever2;
  var auxiliary_effectiveness_label;
  var engden_title;
  var engden_block;

  //ALL CACHE
  var all;
  var prestige_board;
  var button_one;
  var button_two;
  var button_three;
  var button_four;
  var one_supply_label;
  var two_supply_label;
  var three_supply_label;
  var four_supply_label;
  var one_tab;
  var two_tab;
  var three_tab;
  var four_tab;
  var pb_money;
  var money_limit_upgrade;
  var one_tab_contents;
  var two_tab_contents;
  var three_tab_contents;
  var four_tab_contents;

  var one_upgrade_supply_limit;
  var pb_one_upgrade_supply_limit;
  var one_upgrade_effectiveness;
  var pb_one_upgrade_effectiveness;

  var two_upgrade_supply_limit;
  var pb_two_upgrade_supply_limit;
  var two_upgrade_effectiveness;
  var pb_two_upgrade_effectiveness;

  var three_upgrade_supply_limit;
  var pb_three_upgrade_supply_limit;
  var three_upgrade_effectiveness;
  var pb_three_upgrade_effectiveness;

  var four_upgrade_supply_limit;
  var pb_four_upgrade_supply_limit;
  var four_upgrade_effectiveness;
  var pb_four_upgrade_effectiveness;

  var one_ratio_label;
  var two_ratio_label;
  var three_ratio_label;
  var four_ratio_label;

  var money_limit_label;
  var one_effectiveness_label;
  var two_effectiveness_label;
  var three_effectiveness_label;
  var four_effectiveness_label;

  var one_generation_label;
  var two_generation_label;
  var three_generation_label;
  var four_generation_label;

  var one_upgrade_generation;
  var two_upgrade_generation;
  var three_upgrade_generation;
  var four_upgrade_generation;

  var one_name_label;
  var two_name_label;
  var three_name_label;
  var four_name_label;

  var audio_toggle;
  var color_block;

  var pb_money_indicator;
  var pb_one_effectiveness_indicator;
  var pb_two_effectiveness_indicator;
  var pb_three_effectiveness_indicator;
  var pb_four_effectiveness_indicator;
  var pb_one_supply_indicator;
  var pb_two_supply_indicator;
  var pb_three_supply_indicator;
  var pb_four_supply_indicator;

  var actions_label;
  var actions_upgrade;
  var prestige_upgrade;

  var save_timer_label;
  var save_upgrade;
  var reset_upgrade;
  var reset_infobox;
  var gameboard;
  var reset_ok;
  var reset_cancel;
  var prestige_infobox;
  var prestige_ok;
  var prestige_cancel;
  var generator_tabs;
  var arrow_left;
  var arrow_right;
  var factory_switch;
  var control_panel_tab;
  var stats_cancel;
  var stats_infobox;
  var manual_upgrade;
  var total_money_label;
  var all_time_money_label;
  var tillNextAntimatter_label;
  var antimatter_label;
  var antimatter_warping_label;
  var ac_label;
  var pb_antimatter;
  var pb_antimatter_indicator;
  var settings_upgrade;
  var settings_infobox;
  var settings_cancel;
  var audio_toggle_one;
  var audio_toggle_two;
  var audio_toggle_three;
  var audio_toggle_four;
  var audio_toggle_allgen;
  var audio_control_volume;
  var gamesavedump;
  var import_save_button;
  var import_save_dump;
  var g_electric;
  var g_plasma;
  var g_nuclear;
  var g_gravity;
  var antimatter_block;
  var ac_owned_label;
  var reboot_upgrade;
  var magicnumber_block;
  var rank_block;
  var rank_label;
  var magicnumber_label;
  var incorrectsave_infobox;
  var incorrectsave_infobox_cancel;
  var bonusbox;
  var bonusbox_text;
  var telescope;

  var bonusboxblock_1;
  var bonusboxblock_2;
  var bonusboxblock_3;
  var bonusboxblock_4;
  var bonusboxblock_5;
  var bonusboxblock_6;
  var bonusboxblock_7;
  var bonusboxblock_8;

  var ac_stock_label;
  var foundry_info_box;
  var foundry_info_close;
  var foundry_info;
  var engden_info_box;
  var engden_info_close;
  var engden_info;
  var prestige_multiplier_label;
  var rank_infobox;
  var rank_infobox_cancel;
  var rank_description_label;
  var bonus_multiplier_label;
  var furnace_screen;
  var foundry_components_multiplier_label;
  var foundry_components_cycle_upgrade;
  var foundry_components_label;
  var pb_components_multiplier_indicator;
  var pb_components_multiplier;
  var shuttlebay_info;
  var shuttlebay_info_close;
  var shuttlebay_info_box;
  var shuttlebay_block;
  var shuttleport;
  var build_shuttle_row;
  var build_shuttle_upgrade;
  var repair_shuttle_upgrade;
  var pb_build_shuttle;
  var pb_build_shuttle_indicator;
  var pb_repair_shuttle_indicator;
  var pb_repair_shuttle;
  var lscanner_info;
  var lscanner_title;
  var lscanner_block;
  var lscanner_info_box;
  var lscanner_info_close;
  var animal1;
  var animal2;
  var animal3;
  var animal4;
  var animal5;
  var animal6;
  var animal7;
  var animal8;
  var ac_all_label;
  var animal2_magnetron_duration_label;
  var animal3_magnetron_multiplier_label;
  var animal7_battery_charge_multiplier_label;
  var animal6_components_multiplier_label;
  var mc_info_box;
  var mc_info_close;
  var mc_info;
  var shuttle_capacity_upgrade_label;
  var shuttle_capacity_upgrade;
  var mission_debris_block;
  var mission_debris_upgrade_label;
  var mission_station_block;
  var mission_station_upgrade;
  var mission_station_upgrade_label;
  var station_lock_block;
  var station_unlock_upgrade;
  var station_block;
  var station_info;
  var station_info_box;
  var station_info_close;
  var pb_mission_debris_indicator;
  var pb_mission_debris;
  var mission_debris_launch;
  var mission_debris_block_progress;
  var mission_debris_shuttle_name;
  var mission_station_block_progress
  var mission_station_launch;
  var pb_mission_station;
  var pb_mission_station_indicator;
  var mission_station_shuttle_name;
  var mission_telescope_block;
  var mission_telescope_block_progress;
  var mission_telescope_launch;
  var mission_telescope_upgrade_label;
  var mission_telescope_shuttle_name;
  var mission_telescope_upgrade;
  var pb_mission_telescope;
  var pb_mission_telescope_indicator;
  var telescope_lock_block;
  var telescope_block;
  var telescope_unlock_upgrade;
  var space_window;
  var telescope_info;
  var telescope_info_box;
  var telescope_info_close;
  var telescope_seconds;
  var telescope_stars_amount_label;
  var telescope_galaxies_amount_label;
  var telescope_resolution_upgrade;
  var telescope_resolution_label;

  $(document).ready(function(){

    //CACHE

    telescope_resolution_upgrade=$("#telescope_resolution_upgrade");
    telescope_resolution_label=$("#telescope_resolution_label");
    telescope_stars_amount_label=$("#telescope_stars_amount_label");
    telescope_galaxies_amount_label=$("#telescope_galaxies_amount_label");
    telescope_seconds=$("#telescope_seconds");
    telescope_info=$("#telescope_info");
    telescope_info_box=$("#telescope_info_box");
    telescope_info_close=$("#telescope_info_close");
    space_window=$("#space_window");
    telescope_unlock_upgrade=$("#telescope_unlock_upgrade");
    telescope_lock_block=$("#telescope_lock_block");
    telescope_block=$("#telescope_block");
    mission_telescope_block=$("#mission_telescope_block");
    mission_telescope_block_progress=$("#mission_telescope_block_progress");
    mission_telescope_launch=$("#mission_telescope_launch");
    mission_telescope_upgrade_label=$("#mission_telescope_upgrade_label");
    mission_telescope_shuttle_name=$("#mission_telescope_shuttle_name");
    mission_telescope_upgrade=$("#mission_telescope_upgrade");
    pb_mission_telescope=$("#pb_mission_telescope");
    pb_mission_telescope_indicator=$("#pb_mission_telescope_indicator");
    mission_station_shuttle_name=$("#mission_station_shuttle_name");
    mission_station_block_progress=$("#mission_station_block_progress");
    mission_station_launch=$("#mission_station_launch");
    pb_mission_station=$("#pb_mission_station");
    pb_mission_station_indicator=$("#pb_mission_station_indicator");
    mission_debris_shuttle_name=$("#mission_debris_shuttle_name");
    pb_mission_debris_indicator=$("#pb_mission_debris_indicator");
    pb_mission_debris=$("#pb_mission_debris");
    mission_debris_launch=$("#mission_debris_launch");
    mission_debris_block_progress=$("#mission_debris_block_progress");
    station_block=$("#station_block");
    station_info=$("#station_info");
    station_info_box=$("#station_info_box");
    station_info_close=$("#station_info_close");
    station_unlock_upgrade=$("#station_unlock_upgrade");
    station_lock_block=$("#station_lock_block");
    shuttle_capacity_upgrade_label=$("#shuttle_capacity_upgrade_label");
    shuttle_capacity_upgrade=$("#shuttle_capacity_upgrade");
    mission_debris_block=$("#mission_debris_block");
    mission_debris_upgrade_label=$("#mission_debris_upgrade_label");
    mission_station_block=$("#mission_station_block");
    mission_station_upgrade=$("#mission_station_upgrade");
    mission_station_upgrade_label=$("#mission_station_upgrade_label");

    mc_info=$("#mc_info");
    mc_info_close=$("#mc_info_close");
    mc_info_box=$("#mc_info_box");
    animal6_components_multiplier_label=$("#animal6_components_multiplier_label");
    animal7_battery_charge_multiplier_label=$("#animal7_battery_charge_multiplier_label");
    animal2_magnetron_duration_label=$("#animal2_magnetron_duration_label");
    animal3_magnetron_multiplier_label=$("#animal3_magnetron_multiplier_label");
    ac_all_label=$("#ac_all_label");
    animal1=$("#animal1");
    animal2=$("#animal2");
    animal3=$("#animal3");
    animal4=$("#animal4");
    animal5=$("#animal5");
    animal6=$("#animal6");
    animal7=$("#animal7");
    animal8=$("#animal8");

    lscanner_info_close=$("#lscanner_info_close");
    lscanner_info_box=$("#lscanner_info_box");
    lscanner_block=$("#lscanner_block");
    lscanner_title=$("#lscanner_title");
    lscanner_info=$("#lscanner_info");
    pb_repair_shuttle=$("#pb_repair_shuttle");
    pb_repair_shuttle_indicator=$("#pb_repair_shuttle_indicator");
    mc_lock_block=$("#mc_lock_block");
    mc_block=$("#mc_block");
    mc_unlock_upgrade=$("#mc_unlock_upgrade");
    pb_build_shuttle=$("#pb_build_shuttle");
    pb_build_shuttle_indicator=$("#pb_build_shuttle_indicator");
    repair_shuttle_upgrade=$("#repair_shuttle_upgrade");
    shuttlebay_info=$("#shuttlebay_info");
    shuttlebay_info_close=$("#shuttlebay_info_close");
    shuttlebay_info_box=$("#shuttlebay_info_box");
    shuttlebay_block=$("#shuttlebay_block");
    shuttleport=$("#shuttleport");
    build_shuttle_row=$("#build_shuttle_row");
    build_shuttle_upgrade=$("#build_shuttle_upgrade");
    pb_components_multiplier=$("#pb_components_multiplier");
    pb_components_multiplier_indicator=$("#pb_components_multiplier_indicator");
    foundry_components_label=$("#foundry_components_label");
    foundry_components_cycle_upgrade=$("#foundry_components_cycle_upgrade");
    foundry_components_multiplier_label=$("#foundry_components_multiplier_label");
    furnace_screen=$("#furnace_screen");
    rank_description_label=$("#rank_description_label");
    bonus_multiplier_label=$("#bonus_multiplier_label");
    shuttlebay_lock_block=$("#shuttlebay_lock_block");
    shuttlebay_block=$("#shuttlebay_block");
    shuttlebay_unlock_upgrade=$("#shuttlebay_unlock_upgrade");

    rank_infobox_cancel=$("#rank_infobox_cancel");
    rank_infobox=$("#rank_infobox");
    prestige_multiplier_label=$("#prestige_multiplier_label");
    engden_info=$("#engden_info");
    engden_info_box=$("#engden_info_box");
    engden_info_close=$("#engden_info_close");
    foundry_info_box=$("#foundry_info_box");
    foundry_info_close=$("#foundry_info_close");
    foundry_info=$("#foundry_info");
    ac_stock_label=$("#ac_stock_label");

    bonusboxblock_1=$("#bonusboxblock_1");
    bonusboxblock_2=$("#bonusboxblock_2");
    bonusboxblock_3=$("#bonusboxblock_3");
    bonusboxblock_4=$("#bonusboxblock_4");
    bonusboxblock_5=$("#bonusboxblock_5");
    bonusboxblock_6=$("#bonusboxblock_6");
    bonusboxblock_7=$("#bonusboxblock_7");
    bonusboxblock_8=$("#bonusboxblock_8");

    telescope=$("#telescope");

    bonusbox_text=$("#bonusbox_text");
    bonusbox=$(".bonusbox");

    auxiliary_lever1=$("#auxiliary_lever1");
    auxiliary_lever2=$("#auxiliary_lever2");
    auxiliary_effectiveness_label=$("#auxiliary_effectiveness_label");
    engden_title=$("#engden_title");
    engden_block=$("#engden_block");

    incorrectsave_infobox_cancel=$("#incorrectsave_infobox_cancel");
    incorrectsave_infobox=$("#incorrectsave_infobox");
    magicnumber_label=$("#magicnumber_label");
    rank_label=$("#rank_label");
    rank_block=$("#rank_block");
    magicnumber_block=$("#magicnumber_block");

    battery_info_close=$("#battery_info_close");
    battery_info_box=$("#battery_info_box");
    battery_info=$("#battery_info");
    magnetron_info_close=$("#magnetron_info_close");
    magnetron_info_box=$("#magnetron_info_box");
    magnetron_info=$("#magnetron_info");

    foundry_unlock_upgrade=$("#foundry_unlock_upgrade");
    foundry_block=$("#foundry_block");
    foundry_lock_block=$("#foundry_lock_block");

    magnetron_duration_upgrade=$("#magnetron_duration_upgrade");
    magnetron_multiplier_upgrade=$("#magnetron_multiplier_upgrade");
    magnetron_duration_label=$("#magnetron_duration_label");
    magnetron_multiplier_label=$("#magnetron_multiplier_label");
    magnetron_lock_block=$("#magnetron_lock_block");
    magnetron_block=$("#magnetron_block");
    magnetron_button=$("#magnetron_button");
    magnetron_unlock_upgrade=$("#magnetron_unlock_upgrade");

    charge_throughput_upgrade=$("#charge_throughput_upgrade");
    charge_throughput_label=$("#charge_throughput_label");
    battery_effectiveness_label=$("#battery_effectiveness_label");
    battery_charge_percentage_label=$("#battery_charge_percentage_label");
    battery_percent_up=$("#battery_percent_up");
    battery_percent_down=$("#battery_percent_down");
    battery_block=$("#battery_block");
    battery_lock_block=$("#battery_lock_block");
    battery_unlock_upgrade=$("#battery_unlock_upgrade");
    charge_limit_label=$("#charge_limit_label");
    charge_limit_upgrade=$("#charge_limit_upgrade");
    pb_battery=$("#pb_battery");
    pb_battery_indicator=$("#pb_battery_indicator");

    warp_magnetron_multiplier_upgrade=$("#warp_magnetron_multiplier_upgrade");
    warp_magnetron_duration_upgrade=$("#warp_magnetron_duration_upgrade");
    warp_magnetron_alerting_upgrade=$("#warp_magnetron_alerting_upgrade");
    warp_rank1_upgrade=$("#warp_rank1_upgrade");
    warp_rank2_upgrade=$("#warp_rank2_upgrade");
    warp_rank3_upgrade=$("#warp_rank3_upgrade");
    warp_rank4_upgrade=$("#warp_rank4_upgrade");
    warp_wallpaper_upgrade=$("#warp_wallpaper_upgrade");
    warp_amplifier_upgrade=$("#warp_amplifier_upgrade");
    warp_magicnumber_upgrade=$("#warp_magicnumber_upgrade");
    warp_maintenance_upgrade=$("#warp_maintenance_upgrade");

    reboot_upgrade=$("#reboot_upgrade");
    ac_owned_label=$("#ac_owned_label");
    antimatter_block=$("#antimatter_block");
    g_electric=$("#g_electric");
    g_plasma=$("#g_plasma");
    g_nuclear=$("#g_nuclear");
    g_gravity=$("#g_gravity");
    import_save_button=$("#import_save_button");
    import_save_dump=$("#import_save_dump");
    gamesavedump=$("#gamesavedump");
    audio_toggle_one=$("#audio_toggle_one");
    audio_toggle_two=$("#audio_toggle_two");
    audio_toggle_three=$("#audio_toggle_three");
    audio_toggle_four=$("#audio_toggle_four");
    audio_toggle_allgen=$("#audio_toggle_allgen");
    audio_control_volume=$("#audio_control_volume");
    settings_cancel=$("#settings_cancel");
    settings_upgrade=$("#settings_upgrade");
    settings_infobox=$("#settings_infobox");
    manual_upgrade=$("#manual_upgrade");
    tillNextAntimatter_label=$("#tillNextAntimatter_label");
    pb_antimatter=$("#pb_antimatter");
    ac_label=$("#ac_label");
    antimatter_label=$("#antimatter_label");
    antimatter_warping_label=$("#antimatter_warping_label");
    all_time_money_label=$("#all_time_money_label");
    total_money_label=$("#total_money_label");
    stats_infobox=$("#stats_infobox");
    stats_cancel=$("#stats_cancel");
    control_panel_tab=$("#control_panel_tab");
    factory_switch=$("#factory_switch");
    arrow_right=$("#arrow_right");
    arrow_left=$("#arrow_left");
    generator_tabs=$("#generator_tabs");
    prestige_infobox=$("#prestige_infobox");
    prestige_ok=$("#prestige_ok");
    prestige_cancel=$("#prestige_cancel");
    reset_cancel=$("#reset_cancel");
    reset_ok=$("#reset_ok");
    gameboard=$("#gameboard");
    reset_infobox=$("#reset_infobox");
    reset_upgrade=$("#reset_upgrade");
    save_timer_label=$("#save_timer_label");
    save_upgrade=$("#save_upgrade");

    prestige_upgrade=$("#prestige_upgrade");
    actions_label=$("#actions_label");
    actions_upgrade=$("#actions_upgrade");

    pb_one_effectiveness_indicator=$("#pb_one_effectiveness_indicator");
    pb_two_effectiveness_indicator=$("#pb_two_effectiveness_indicator");
    pb_three_effectiveness_indicator=$("#pb_three_effectiveness_indicator");
    pb_four_effectiveness_indicator=$("#pb_four_effectiveness_indicator");
    pb_one_supply_indicator=$("#pb_one_supply_indicator");
    pb_two_supply_indicator=$("#pb_two_supply_indicator");
    pb_three_supply_indicator=$("#pb_three_supply_indicator");
    pb_four_supply_indicator=$("#pb_four_supply_indicator");
    pb_money_indicator=$("#pb_money_indicator");
    pb_antimatter_indicator=$("#pb_antimatter_indicator");
    color_block=$(".color_block");
    audio_toggle=$("#audio_toggle");

    one_name_label=$("#one_name_label");
    two_name_label=$("#two_name_label");
    three_name_label=$("#three_name_label");
    four_name_label=$("#four_name_label");

    one_generation_label=$("#one_generation_label");
    two_generation_label=$("#two_generation_label");
    three_generation_label=$("#three_generation_label");
    four_generation_label=$("#four_generation_label");

    one_upgrade_generation=$("#one_upgrade_generation");
    two_upgrade_generation=$("#two_upgrade_generation");
    three_upgrade_generation=$("#three_upgrade_generation");
    four_upgrade_generation=$("#four_upgrade_generation");

    money_limit_label=$("#money_limit_label");
    one_effectiveness_label=$("#one_effectiveness_label");
    two_effectiveness_label=$("#two_effectiveness_label");
    three_effectiveness_label=$("#three_effectiveness_label");
    four_effectiveness_label=$("#four_effectiveness_label");

    one_ratio_label=$("#one_ratio_label");
    two_ratio_label=$("#two_ratio_label");
    three_ratio_label=$("#three_ratio_label");
    four_ratio_label=$("#four_ratio_label");

    one_upgrade_effectiveness=$("#one_upgrade_effectiveness");
    pb_one_upgrade_effectiveness=$("#pb_one_upgrade_effectiveness");
    pb_one_upgrade_supply_limit=$("#pb_one_upgrade_supply_limit");
    one_upgrade_supply_limit=$("#one_upgrade_supply_limit");

    two_upgrade_effectiveness=$("#two_upgrade_effectiveness");
    pb_two_upgrade_effectiveness=$("#pb_two_upgrade_effectiveness");
    pb_two_upgrade_supply_limit=$("#pb_two_upgrade_supply_limit");
    two_upgrade_supply_limit=$("#two_upgrade_supply_limit");

    three_upgrade_effectiveness=$("#three_upgrade_effectiveness");
    pb_three_upgrade_effectiveness=$("#pb_three_upgrade_effectiveness");
    pb_three_upgrade_supply_limit=$("#pb_three_upgrade_supply_limit");
    three_upgrade_supply_limit=$("#three_upgrade_supply_limit");

    four_upgrade_effectiveness=$("#four_upgrade_effectiveness");
    pb_four_upgrade_effectiveness=$("#pb_four_upgrade_effectiveness");
    pb_four_upgrade_supply_limit=$("#pb_four_upgrade_supply_limit");
    four_upgrade_supply_limit=$("#four_upgrade_supply_limit");

    two_tab_contents=$("#two_tab_contents");
    one_tab_contents=$("#one_tab_contents");
    three_tab_contents=$("#three_tab_contents");
    four_tab_contents=$("#four_tab_contents");

    money_limit_upgrade=$("#money_limit_upgrade");

    pb_money=$("#pb_money");
    four_tab=$("#four_tab");
    three_tab=$("#three_tab");
    two_tab=$("#two_tab");
    one_tab=$("#one_tab");
    one_supply_label=$("#one_supply_label");
    two_supply_label=$("#two_supply_label");
    three_supply_label=$("#three_supply_label");
    four_supply_label=$("#four_supply_label");
    button_one=$("#button_one");
    button_two=$("#button_two");
    button_three=$("#button_three");
    button_four=$("#button_four");
    prestige_board=$("#prestige_board");
    all=$("#all");


    document.title = "Machinery "+version;
          console.log("Machinery "+version);
          console.log("created by Louigi Verona");
          console.log("https://louigiverona.com/?page=about");
    Howler.volume(audio_volume);//default volume

    if(localStorage.getItem("machineryGameData")){
      LoadGame();
      //Init();//test
    }else{
      Init();
    }

    $("html").keydown(function( event ) {
			  switch (event.key){
					case "w":
            //for testing

            //console.log(antimatter);

					break;
				  }
			});

    //TABS
    color_block.click(function(){

      PlayAudio(10);

      $('.color_block').css("background-color","#1a1a1a");
      $('.color_block').css("color","#999");
      one_tab_contents.hide();
      two_tab_contents.hide();
      three_tab_contents.hide();
      four_tab_contents.hide();

      var id = $(this).attr('id');

      switch(id){
        case 'one_tab':
          one_tab_contents.show();active_tab_flag=1;
          one_tab.css("background-color","#30b8d0");
          one_tab.css("color","#1a1a1a");
        break;
        case 'two_tab':
          two_tab_contents.show();active_tab_flag=2;
          two_tab.css("background-color","#dbd45f");
          two_tab.css("color","#1a1a1a");
        break;
        case 'three_tab':
          three_tab_contents.show();active_tab_flag=3;
          three_tab.css("background-color","#db3356");
          three_tab.css("color","#1a1a1a");
        break;
        case 'four_tab':
          four_tab_contents.show();active_tab_flag=4;
          four_tab.css("background-color","#9f9f9f");
          four_tab.css("color","#1a1a1a");
        break;
      }

      storeState();
      });

    audio_toggle.click(function(){
      if(audio_mute==0){
        PlayAudio(1);//has to be here in order to be played
        audio_mute=1;
        audio_toggle.text("Unmute audio");
        button3Red(audio_toggle);
      }else{
        audio_mute=0;
        PlayAudio(1);//has to be here in order to be played
        audio_toggle.text("Mute audio");
        button3Green(audio_toggle);
      }
    });
    audio_toggle_one.click(function(){
              PlayAudio(1);
      if(audio_mute_one==0){
        audio_mute_one=1;
        audio_toggle_one.text("Unmute Electric");
        button3Red(audio_toggle_one);
      }else{
        audio_mute_one=0;
        audio_toggle_one.text("Mute Electric");
        button3Green(audio_toggle_one);
      }
    });
    audio_toggle_two.click(function(){
              PlayAudio(1);
      if(audio_mute_two==0){
        audio_mute_two=1;
        audio_toggle_two.text("Unmute Plasma");
        button3Red(audio_toggle_two);
      }else{
        audio_mute_two=0;
        audio_toggle_two.text("Mute Plasma");
        button3Green(audio_toggle_two);
      }
    });
    audio_toggle_three.click(function(){
              PlayAudio(1);
      if(audio_mute_three==0){
        audio_mute_three=1;
        audio_toggle_three.text("Unmute Nuclear");
        button3Red(audio_toggle_three);
      }else{
        audio_mute_three=0;
        audio_toggle_three.text("Mute Nuclear");
        button3Green(audio_toggle_three);
      }
    });
    audio_toggle_four.click(function(){
              PlayAudio(1);
      if(audio_mute_four==0){
        audio_mute_four=1;
        audio_toggle_four.text("Unmute Gravity");
        button3Red(audio_toggle_four);
      }else{
        audio_mute_four=0;
        audio_toggle_four.text("Mute Gravity");
        button3Green(audio_toggle_four);
      }
    });
    audio_toggle_allgen.click(function(){
              PlayAudio(1);
      if(audio_mute_allgen==0){
        audio_mute_allgen=1;
        audio_mute_one=1;
        audio_mute_two=1;
        audio_mute_three=1;
        audio_mute_four=1;
        audio_toggle_one.text("Unmute Electric");
        audio_toggle_two.text("Unmute Plasma");
        audio_toggle_three.text("Unmute Nuclear");
        audio_toggle_four.text("Unmute Gravity");
        audio_toggle_allgen.text("Unmute All");
        button3Red(audio_toggle_one);
        button3Red(audio_toggle_two);
        button3Red(audio_toggle_three);
        button3Red(audio_toggle_four);
        button3Red(audio_toggle_allgen);
      }else{
        audio_mute_allgen=0;
        audio_mute_one=0;
        audio_mute_two=0;
        audio_mute_three=0;
        audio_mute_four=0;
        audio_toggle_one.text("Mute Electric");
        audio_toggle_two.text("Mute Plasma");
        audio_toggle_three.text("Mute Nuclear");
        audio_toggle_four.text("Mute Gravity");
        audio_toggle_allgen.text("Mute All");
        button3Green(audio_toggle_one);
        button3Green(audio_toggle_two);
        button3Green(audio_toggle_three);
        button3Green(audio_toggle_four);
        button3Green(audio_toggle_allgen);
      }
    });
    audio_control_volume.mousemove(function(){
        audio_volume=audio_control_volume.val();
        Howler.volume(audio_volume);
    });



    save_upgrade.click(function(){
      PlayAudio(2);
      save_sec=120;
      button3Disable(save_upgrade);
      SaveGame();
    });

    settings_upgrade.click(function(){
      PlayAudio(10);
      if(settings_window_flag==0){
        closeWindows();
        settings_infobox.show();
        settings_window_flag=1;
        windowScroll();
      }else{
        settings_infobox.hide();
        settings_window_flag=0;
      }
    });
    settings_cancel.click(function(){
      PlayAudio(10);
      settings_infobox.hide();
      settings_window_flag=0;
    });

    incorrectsave_infobox_cancel.click(function(){
      PlayAudio(1);
      incorrectsave_infobox.hide();
    });

    reset_upgrade.click(function(){
      PlayAudio(2);
      if(reset_window_flag==0){
        closeWindows();
        windowScroll();
        reset_infobox.show();
        reset_window_flag=1;
      }else{
        reset_infobox.hide();
        reset_window_flag=0;
      }

    });
    reset_cancel.click(function(){
      PlayAudio(2);
      reset_infobox.hide();
      reset_window_flag=0;
    });
    reset_ok.click(function(){
      PlayAudio(2);
      clearInterval(save_timer);
      localStorage.removeItem("machineryGameData");
      reset_infobox.text("Game data reset. Reload page.");
    });

    antimatter_block.click(function(){

      PlayAudio(10);

      if(stats_window_flag==0){
        closeWindows();
        stats_infobox.show();
        all_time_money_label.text("⌬" + numT(all_time_money));
          if(lscanner_state==1){
            total_money_label.text("⌬" + numT(total_money) + " ("+(Math.floor(antimatter/antimatter_cubes*100))+"%)");
          }else{
            total_money_label.text("⌬" + numT(total_money));
          }
        tillNextAntimatter_label.text("⌬" + numT( nextAntimatterCost - all_time_money ) );
        ac_stock_label.text( numT( antimatter_cubes-antimatter_cubes_spent ) );
        stats_window_flag=1;
        windowScroll();
      }else{
        stats_infobox.hide();
        stats_window_flag=0;
      }

    });
    stats_cancel.click(function(){
      PlayAudio(10);
      stats_infobox.hide();
      stats_window_flag=0;
    });

    rank_block.click(function(){

      PlayAudio(10);

      if(rankinfo_window_flag==0){

        var rank;

        if(engden_state==0){rank=0;}//operator
        if(engden_state==1){rank=1;}//engineer
        if(lscanner_state==1){rank=2;}//floor admin
        if(chief==1){rank=3;}//chief engineer

        switch(rank){
          case 0: rank_description_label.html("You are an <b>operator</b>. You have basic knowledge of how machines work, but you do feel a strong kinship with everything non-organic. You even have a non-organic isopod as a pet, but it's your little secret.");
          break;
          case 1: rank_description_label.html("You are an <b>engineer</b>. You have a deep understanding of machines and know how to tweak them to make seemingly impossible things happen. You are part of a noble profession and are proud to speak the language of non-organics.");
          break;
          case 2: rank_description_label.html("You are a <b>floor administrator</b>. You are now part of a very special engineering tribe that keeps the quickly evolving non-organic jungle at bay. Some things that you've seen were not meant for human eyes.");
          break;
          case 3: rank_description_label.html("You are <b>chief engineer</b>. You are a fatherly figure to the engineers and floor administrators on your team. You provide wisdom, experience and moral support. A lot of the things you say become aphorisms that are passed down to new generations.");
          break;
        }


        prestige_multiplier_label.text("x" + numT(prestige_multiplier) + " to all generators' power");

        bonus_multiplier_label.text("+" + numT( (bonus_multiplier+animal1_bonus_multiplier-1)*100 ) + "% to all generators' power");

        closeWindows();
        rank_infobox.show();
        rankinfo_window_flag=1;
        windowScroll();
      }else{
        rank_infobox.hide();
        rankinfo_window_flag=0;
      }

    });
    rank_infobox_cancel.click(function(){
      PlayAudio(10);
      rank_infobox.hide();
      rankinfo_window_flag=0;
    });

    manual_upgrade.click(function(){
      PlayAudio(2);

    });

    import_save_button.click(function(){

      PlayAudio(2);

      localStorage.setItem('machineryGameData', import_save_dump.text());
      import_save_dump.text('');
      settings_infobox.hide();settings_window_flag=0;
      LoadGame();

    });

    //INFOs
    battery_info.click(function(){

      $(battery_info_box).show();
      PlayAudio(2);
    });
    battery_info_close.click(function(){

      $(battery_info_box).hide();
      PlayAudio(2);

    });

    magnetron_info.click(function(){

      $(magnetron_info_box).show();
      PlayAudio(2);

    });
    magnetron_info_close.click(function(){

      $(magnetron_info_box).hide();
      PlayAudio(2);

    });

    foundry_info.click(function(){

      $(foundry_info_box).show();
      PlayAudio(2);

    });
    foundry_info_close.click(function(){

      $(foundry_info_box).hide();
      PlayAudio(2);

    });

    engden_info.click(function(){

      $(engden_info_box).show();
      PlayAudio(2);

    });
    engden_info_close.click(function(){

      $(engden_info_box).hide();
      PlayAudio(2);

    });

    lscanner_info.click(function(){

      $(lscanner_info_box).show();
      PlayAudio(2);

    });
    lscanner_info_close.click(function(){

      $(lscanner_info_box).hide();
      PlayAudio(2);

    });

    shuttlebay_info.click(function(){

      $(shuttlebay_info_box).show();
      PlayAudio(2);

    });
    shuttlebay_info_close.click(function(){

      $(shuttlebay_info_box).hide();
      PlayAudio(2);

    });

    mc_info.click(function(){

      $(mc_info_box).show();
      PlayAudio(2);

    });
    mc_info_close.click(function(){

      $(mc_info_box).hide();
      PlayAudio(2);

    });

    station_info.click(function(){

      $(station_info_box).show();
      PlayAudio(2);

    });
    station_info_close.click(function(){

      $(station_info_box).hide();
      PlayAudio(2);

    });

    telescope_info.click(function(){

      $(telescope_info_box).show();
      PlayAudio(2);

    });
    telescope_info_close.click(function(){

      $(telescope_info_box).hide();
      PlayAudio(2);

    });

    //research lab item
    bonusbox.click(function(){

      PlayAudio(8);

      actions++;ActionsUpdate();

      //get id of element
      const id = $(this).attr('id').split('_');
      //pay
      money-=researchList.price[id[1]-1];

      //apply effect
      if(researchList.type[id[1]-1]==1){//increase bonus_multiplier by given percentage
        //bonus_multiplier*=(1+researchList.effect[id[1]-1]*0.01);//old formula that multiplied the bonus multiplier, therefore growing it exponentially
        bonus_multiplier+=researchList.effect[id[1]-1]*0.01;
        //notificationDisplay("Power increased by "+researchList.effect[id[1]-1]+"%");
        if(rankinfo_window_flag==1){
          bonus_multiplier_label.text("+" + numT( (bonus_multiplier+animal1_bonus_multiplier-1)*100 ) + "% to all generators' power");
        }
      }
      else if(researchList.type[id[1]-1]==2){//double the supply limit of the least supplied generator

        var supply_list=[
          [one_price,1],
          [two_price,2],
          [three_price,3],
          [four_price,4]
        ];
        //descending order
        supply_list.sort(function(a, b) {
          return a[0] - b[0];
        });

        //remove empty values
        const newSupplyList = supply_list.filter((a) => a[0]);

        //double the supply limit of the least supplied generator
        switch(newSupplyList[0][1]){
          case 1:
          one_price*=2;
          button_one.text(numT(one_price));
          //notificationDisplay("Electric generator's supply doubled!");
          break;
          case 2:
          two_price*=2;
          button_two.text(numT(two_price));
          //notificationDisplay("Plasma generator's supply doubled!");
          break;
          case 3:
          three_price*=2;
          button_three.text(numT(three_price));
          //notificationDisplay("Nuclear generator's supply doubled!");
          break;
          case 4:
          four_price*=2;
          button_four.text(numT(four_price));
          //notificationDisplay("Gravity generator's supply doubled!");
          break;
        }



      }
      else if(researchList.type[id[1]-1]==3){//lifeforms

        if(lscanner_state==1){//if Lifeforms Scanner is unlocked

          var lifeform_id=researchList.effect[id[1]-1];
          last_animal=lifeform_id;//saving last animal

          lifeforms_collection[lifeform_id]+=1;//adding the lifeform to the collection
          buildLifeformsCollection();//rebuilding the collection

        }



      }

      //remove the item
      researchList.price.splice(id[1]-1, 1);
      researchList.type.splice(id[1]-1, 1);
      researchList.effect.splice(id[1]-1, 1);

      //generate a new item and rebuild
      researchRequest();
      InventoryUpdate();

      });

    //PRESTIGE
    prestige_upgrade.click(function(){

      PlayAudio(2);
      if(prestige_window_flag==0){
      closeWindows();
      prestige_infobox.show();
      windowScroll();
      antimatter_warping_label.text( numT( antimatter ) );
      ac_label.text( numT( antimatter ) );
      prestige_window_flag=1;
      }else{
      prestige_window_flag=0;
      prestige_infobox.hide();
      }
    });
    prestige_cancel.click(function(){
      PlayAudio(2);
      prestige_infobox.hide();
      prestige_window_flag=0;
    });
    prestige_ok.click(function(){//warp
      PlayAudio(2);

      //LOOPS
      clearInterval(telescope_timer);//stop the telescope
      clearInterval(magnetron_interval);//stop the magnetron
      clearInterval(save_timer);//stop the save timer, so that if someone reloads at this point, we don't run into problems
      clearInterval(one_interval);//stop all generators
      clearInterval(two_interval);
      clearInterval(three_interval);
      clearInterval(four_interval);
      clearInterval(furnace_cooling_timer);
      furnace_cooling_timer = null;

      closeWindows();
      all.hide();

      //if the player rebooted too quickly, lifeforms become rare for that run
      if( Math.floor(antimatter_cubes/antimatter)>=4 ){recency++;}
      else{recency=0;}

      antimatter_cubes+=antimatter;antimatter=0;//converting antimatter to cubes;i reset antimatter here, although Init does it as well



      prestige_multiplier=antimatter_cubes;

      if(warp_amplifier_upgrade_flag>0){//adding that additional boost, whatever it was
        prestige_multiplier *= 10;
      }

      //changing the power limit in accordance with the new prestige_multiplier, so that the player does not have to tediously click away the power limit; the solution is not perfect, as eventually you start with a huge power limit and it might first seem like your power has dropped; however, it does help greatly to breeze through the initial upgrades without coming up with a bulk buy formula (which, unfortunately, wouldn't be trivial at all, since power growth is not simple)
      if(prestige_multiplier>50){
        money_limit_init=prestige_multiplier*5;
        money_limit_upgrade_price_init=prestige_multiplier;
      }
      if(prestige_multiplier>1000){
        money_limit_init=prestige_multiplier*prestige_multiplier*5;
        money_limit_upgrade_price_init=prestige_multiplier*prestige_multiplier;
      }

      prestigeInit();
      prestige_board.show();

    });
    reboot_upgrade.click(function(){
      PlayAudio(2);
      prestige_board.hide();
      all.show();
      Init();
    });

        warp_amplifier_upgrade.click(function(){

          PlayAudio(2);

          antimatter_cubes_spent+=warp_amplifier_upgrade_price;

          prestige_multiplier*=10;
          warp_amplifier_upgrade_flag=prestige_multiplier;
          prestigeState();

        });

        warp_maintenance_upgrade.click(function(){

          PlayAudio(2);

          antimatter_cubes_spent+=warp_maintenance_upgrade_price;

          warp_maintenance_upgrade_price=warp_maintenance_upgrade_price*Math.pow(10,6);
          warp_maintenance_upgrade.text(numT(warp_maintenance_upgrade_price));

          actions_limit=100;
          prestigeState();

        });

        warp_magnetron_duration_upgrade.click(function(){

          PlayAudio(2);

          antimatter_cubes_spent+=warp_magnetron_duration_upgrade_price;

          warp_magnetron_duration_upgrade.text("Sold");
          button2Disable(warp_magnetron_duration_upgrade);

          warp_max_magnetron_duration=120;

          prestigeState();

        });
        warp_magnetron_multiplier_upgrade.click(function(){

          PlayAudio(2);

          antimatter_cubes_spent+=warp_magnetron_multiplier_upgrade_price;

          warp_magnetron_multiplier_upgrade.text("Sold");
          button2Disable(warp_magnetron_multiplier_upgrade);

          warp_max_magnetron_multiplier=20;

          prestigeState();

        });
        warp_magnetron_alerting_upgrade.click(function(){

          PlayAudio(2);

          antimatter_cubes_spent+=warp_magnetron_alerting_upgrade_price;

          warp_magnetron_alerting_upgrade.text("Sold");
          button2Disable(warp_magnetron_alerting_upgrade);

          warp_magnetron_alerting=1;

          prestigeState();

        });

        warp_rank1_upgrade.click(function(){

          PlayAudio(2);

          antimatter_cubes_spent+=warp_rank1_upgrade_price;

          warp_rank1_upgrade.text("Sold");
          button2Disable(warp_rank1_upgrade);

          engden_state=1;//this defines the player being an Engineer

          prestigeState();

        });
        warp_rank2_upgrade.click(function(){

          PlayAudio(2);

          antimatter_cubes_spent+=warp_rank2_upgrade_price;

          warp_rank2_upgrade.text("Sold");
          button2Disable(warp_rank2_upgrade);

          lscanner_state=1;//this defines the player being a Floor Admin

          prestigeState();

        });

        warp_magicnumber_upgrade.click(function(){

          PlayAudio(2);

          antimatter_cubes_spent+=warp_magicnumber_upgrade_price;

          warp_magicnumber_upgrade.text("Sold");
          button2Disable(warp_magicnumber_upgrade);

          magicnumber++;
          warp_magicnumber_upgrade_flag=1;
          prestigeState();

        });


    button_one.click(function(){

      PlayAudio(1);

      one_supply=one_price;
      one_supply_label.text(numT(one_supply));

      button1Disable($(this));

      if(money<money_limit){actions++;ActionsUpdate();}

      //g_electric.css('background-image', 'url("img/g_electric.png")');

      One();

    });
    button_two.click(function(){

      PlayAudio(1);

      if(getRandomInt(1,50)==3){
        PlayAudio(9);
      }

      two_supply=two_price;
      two_supply_label.text(numT(two_supply));

      button1Disable($(this));

      if(money<money_limit){actions++;ActionsUpdate();}

      Two();

    });
    button_three.click(function(){

      PlayAudio(1);

      three_supply=three_price;
      three_supply_label.text(numT(three_supply));

      button1Disable($(this));

      if(money<money_limit){actions++;ActionsUpdate();}

      Three();

    });
    button_four.click(function(){

      PlayAudio(1);

      four_supply=four_price;
      four_supply_label.text(numT(four_price));

      button1Disable($(this));

      if(money<money_limit){actions++;ActionsUpdate();}

      Four();

    });

    //UPGRADE EVENT HANDLERS

    //GENERAL
    money_limit_upgrade.click(function(){

      PlayAudio(2);

      money-=money_limit_upgrade_price;
      money_limit=Math.floor(money_limit*1.5);

      money_limit_upgrade_price= Math.floor(money_limit_upgrade_price + money_limit_upgrade_price*0.5);

      money_limit_upgrade.text("⌬" + numT(money_limit_upgrade_price));

      money_limit_label.text("["+numT(money_limit)+"]");

      actions++;ActionsUpdate();
      InventoryUpdate();

    });
    actions_upgrade.click(function(){//overdrive
      PlayAudio(5);

      var overdrive_bonus=0;
      if(one_price>0){overdrive_bonus+=one_multiplier*100;}
      if(two_price>0){overdrive_bonus+=two_multiplier*100;}
      if(three_price>0){overdrive_bonus+=three_multiplier*100;}
      if(four_price>0){overdrive_bonus+=four_multiplier*100;}

      //moneyCalc(money_limit);//old overdrive mechanic
      moneyCalc(overdrive_bonus);

      actions=0; button2Disable($(this));
      //money_limit_label.text("["+numT(money_limit)+"]");

      actions_limit++;

      ActionsUpdate();
      InventoryUpdate();
    });

    //GENERATORS
    one_upgrade_supply_limit.click(function(){

      var label;

      PlayAudio(2);

      money-=one_upgrade_supply_limit_price;

      one_upgrade_supply_limit_stage+=20;
      if(one_upgrade_supply_limit_stage==100){one_upgrade_supply_limit_stage=0;one_price=one_price*2;}
      else{one_price++;}
      if(one_upgrade_supply_limit_stage==80){label="x2";}
      else{label="+1";}


      button_one.text(numT(one_price));

      one_upgrade_supply_limit_price= Math.floor(one_upgrade_supply_limit_price + one_upgrade_supply_limit_price*(sgr-animal4_supply_price_reduction));
      one_upgrade_supply_limit.text("⌬" + numT(one_upgrade_supply_limit_price));

      progress3(one_upgrade_supply_limit_stage,pb_one_upgrade_supply_limit,pb_one_supply_indicator,label);

      actions++;ActionsUpdate();

      InventoryUpdate();

    });
    one_upgrade_effectiveness.click(function(){

      var label;

      PlayAudio(2);

      one_ratios_flag=1;

      money-=one_upgrade_effectiveness_price;

      one_upgrade_effectiveness_stage+=4;
      if(one_upgrade_effectiveness_stage==100){

        if(one_upgrade_effectiveness_level % 2 === 0){one_upgrade_effectiveness_stage=0;one_multiplier=one_multiplier*100;}
        else{one_upgrade_effectiveness_stage=0;one_multiplier=one_multiplier*5;}

        one_upgrade_effectiveness_level++;
        //console.log(one_upgrade_effectiveness_level);

      }
      else{one_multiplier+=one_init_multiplier;}
      if(one_upgrade_effectiveness_stage==96){//multipliers

        if(one_upgrade_effectiveness_level % 2 === 0){label="x100";}
        //else if(one_upgrade_effectiveness_level % 5 === 0){label="x2";}
        else{label="x5";}

      }
      else{label="+"+numT(one_init_multiplier);}

      one_upgrade_effectiveness_price= Math.floor(one_upgrade_effectiveness_price + one_upgrade_effectiveness_price*egr);
      one_upgrade_effectiveness.text("⌬" + numT(one_upgrade_effectiveness_price));
      //console.log(one_upgrade_effectiveness_price);

      //check if the next iteration puts the price over the next generation price and hide the button
      if(Math.floor(one_upgrade_effectiveness_price + one_upgrade_effectiveness_price*egr)>one_upgrade_generation_price){
        one_upgrade_effectiveness.css("visibility", "hidden").blur();
      }

      if(one_upgrade_effectiveness_price>one_upgrade_generation_price){//if the price becomes more than the price of the next generation, it raises the price of the next generation. Without this limiting mechanism, one would be able to unleash a runaway effect that would generate infinite energy at virtually no cost
        one_upgrade_generation_price = one_upgrade_effectiveness_price;
        one_upgrade_generation.text("⌬" + numT(one_upgrade_generation_price));
      }

      progress3(one_upgrade_effectiveness_stage,pb_one_upgrade_effectiveness,pb_one_effectiveness_indicator,label);

      actions++;ActionsUpdate();

      one_effectiveness_label.text("["+numT(one_multiplier)+"]");
      InventoryUpdate();

    });
    one_upgrade_generation.click(function(){

      var label;

      PlayAudio(2);

      //incrementing generation
      one_generation++;

      //to make sure we will recalculate ratios when we start this generator
      one_ratios_flag=1;

      money-=one_upgrade_generation_price;

      //generating generator multiplier
      one_init_multiplier=one_init_multiplier*100000000;//because the biggest bonus here is the increase of the init_multiplier, if your effectiveness is very high from the beginning (due to prestige bonuses), what can happen is that you breeze through several generations without growing the normal multiplier (like, one_multiplier), and then when you've upgraded to a new generation and ran out of money, the generator will be very weak up until the time you actually begin upgrading its effectiveness, because it will then add a lot. in other words, it seems like it makes sense to grow generators and not skip generations %)
      //one_multiplier=one_init_multiplier;

      one_multiplier=one_multiplier*100;//this could be thought of as a bonus that you get at the end of the effectiveness progress bar, which is either x5 or x100

      //effectiveness price
      one_upgrade_effectiveness_price= Math.floor(one_upgrade_generation_price);
      one_upgrade_effectiveness.text("⌬" + numT(one_upgrade_effectiveness_price));
      //supply limit price
      one_upgrade_supply_limit_price= Math.floor(one_upgrade_generation_price);
      one_upgrade_supply_limit.text("⌬" + numT(one_upgrade_supply_limit_price));

      //resetting the generator
      one_x=0;g_electric.css('background-position', + one_x + 'px 0px');
      clearInterval(one_interval);

      //resetting effectiveness
      one_upgrade_effectiveness_stage=0;
      one_upgrade_effectiveness_level=1;

      one_effectiveness_label.text("["+numT(one_multiplier)+"]");
      label="+"+numT(one_init_multiplier);
      progress3(one_upgrade_effectiveness_stage,pb_one_upgrade_effectiveness,pb_one_effectiveness_indicator,label);

      //resetting supply
      one_upgrade_supply_limit_stage=0;
      one_supply=0;one_supply_label.text(one_supply);
      one_price=1;
      button_one.text(numT(one_price));
      button1Enable(button_one);

      progress3(0,pb_one_upgrade_supply_limit,pb_one_supply_indicator,"+1");

      //generator generation price
      one_upgrade_generation_price= one_upgrade_generation_price*Math.pow(10,14);//was 12
      one_upgrade_generation.text("⌬" + numT(one_upgrade_generation_price));

      //other updates
      actions++;ActionsUpdate();
      one_generation_label.text("Generation " + romanize(one_generation+1));
      one_name_label.text("Electric " + romanize(one_generation));
      one_upgrade_effectiveness.css("visibility", "visible");//removing the alert of going over the generation price
      InventoryUpdate();

    });


    two_upgrade_supply_limit.click(function(){

      var label;

      PlayAudio(2);

      money-=two_upgrade_supply_limit_price;

      if(two_price==0){button1Enable(button_two);}

      two_upgrade_supply_limit_stage+=20;
      if(two_upgrade_supply_limit_stage==100){two_upgrade_supply_limit_stage=0;two_price=two_price*2;}
      else{two_price++;}
      if(two_upgrade_supply_limit_stage==80){label="x2";}
      else{label="+1";}


      button_two.text(numT(two_price));

      two_upgrade_supply_limit_price= Math.floor(two_upgrade_supply_limit_price + two_upgrade_supply_limit_price*(sgr-animal4_supply_price_reduction));
      two_upgrade_supply_limit.text("⌬" + numT(two_upgrade_supply_limit_price));

      progress3(two_upgrade_supply_limit_stage,pb_two_upgrade_supply_limit,pb_two_supply_indicator,label);

      actions++;ActionsUpdate();

      InventoryUpdate();

    });
    two_upgrade_effectiveness.click(function(){

      var label;

      PlayAudio(2);

      two_ratios_flag=1;

      money-=two_upgrade_effectiveness_price;

      two_upgrade_effectiveness_stage+=4;
      if(two_upgrade_effectiveness_stage==100){

        if(two_upgrade_effectiveness_level % 2 === 0){two_upgrade_effectiveness_stage=0;two_multiplier=two_multiplier*100;}
        else{two_upgrade_effectiveness_stage=0;two_multiplier=two_multiplier*5;}

        two_upgrade_effectiveness_level++;

      }
      else{two_multiplier+=two_init_multiplier;}

      if(two_upgrade_effectiveness_stage==96){//multipliers

        if(two_upgrade_effectiveness_level % 2 === 0){label="x100";}
        else{label="x5";}

      }
      else{label="+"+numT(two_init_multiplier);}

      two_upgrade_effectiveness_price= Math.floor(two_upgrade_effectiveness_price + two_upgrade_effectiveness_price*egr);
      two_upgrade_effectiveness.text("⌬" + numT(two_upgrade_effectiveness_price));

      if(Math.floor(two_upgrade_effectiveness_price + two_upgrade_effectiveness_price*egr)>two_upgrade_generation_price){
        two_upgrade_effectiveness.css("visibility", "hidden").blur();
      }

      if(two_upgrade_effectiveness_price>two_upgrade_generation_price){
        two_upgrade_generation_price = two_upgrade_effectiveness_price;
        two_upgrade_generation.text("⌬" + numT(two_upgrade_generation_price));
      }

      progress3(two_upgrade_effectiveness_stage,pb_two_upgrade_effectiveness,pb_two_effectiveness_indicator,label);

      actions++;ActionsUpdate();

      two_effectiveness_label.text("["+numT(two_multiplier)+"]");
      InventoryUpdate();

    });
    two_upgrade_generation.click(function(){

      var label;

      PlayAudio(2);

      //incrementing generation
      two_generation++;

      //to make sure we will recalculate ratios when we start this generator
      two_ratios_flag=1;

      money-=two_upgrade_generation_price;

      //generating generator multiplier
      two_init_multiplier=two_init_multiplier*100000000;
      //two_multiplier=two_init_multiplier;

      //NEW
      two_multiplier=two_multiplier*100;

      //effectiveness price
      two_upgrade_effectiveness_price= Math.floor(two_upgrade_generation_price);
      two_upgrade_effectiveness.text("⌬" + numT(two_upgrade_effectiveness_price));
      //supply limit price
      two_upgrade_supply_limit_price= Math.floor(two_upgrade_generation_price);
      two_upgrade_supply_limit.text("⌬" + numT(two_upgrade_supply_limit_price));

      //resetting the generator
      two_x=0;g_plasma.css('background-position', + two_x + 'px 0px');
      clearInterval(two_interval);

      //resetting effectiveness
      two_upgrade_effectiveness_stage=0;
      two_upgrade_effectiveness_level=1;

      two_effectiveness_label.text("["+numT(two_multiplier)+"]");
      label="+"+numT(two_init_multiplier);
      progress3(two_upgrade_effectiveness_stage,pb_two_upgrade_effectiveness,pb_two_effectiveness_indicator,label);

      //resetting supply
      two_upgrade_supply_limit_stage=0;
      two_supply=0;two_supply_label.text(two_supply);
      two_price=1;
      button_two.text(numT(two_price));
      button1Enable(button_two);

      progress3(0,pb_two_upgrade_supply_limit,pb_two_supply_indicator,"+1");

      //generator generation price
      two_upgrade_generation_price= two_upgrade_generation_price*Math.pow(10,14);
      two_upgrade_generation.text("⌬" + numT(two_upgrade_generation_price));

      //other updates
      actions++;ActionsUpdate();
      two_generation_label.text("Generation " + romanize(two_generation+1));
      two_name_label.text("Plasma " + romanize(two_generation));
      two_upgrade_effectiveness.css("visibility", "visible");
      InventoryUpdate();

    });


    three_upgrade_supply_limit.click(function(){

      var label;

      PlayAudio(2);

      money-=three_upgrade_supply_limit_price;

      if(three_price==0){button1Enable(button_three);}

      three_upgrade_supply_limit_stage+=20;
      if(three_upgrade_supply_limit_stage==100){three_upgrade_supply_limit_stage=0;three_price=three_price*2;}
      else{three_price++;}
      if(three_upgrade_supply_limit_stage==80){label="x2";}
      else{label="+1";}


      button_three.text(numT(three_price));

      three_upgrade_supply_limit_price= Math.floor(three_upgrade_supply_limit_price + three_upgrade_supply_limit_price*(sgr-animal4_supply_price_reduction));
      three_upgrade_supply_limit.text("⌬" + numT(three_upgrade_supply_limit_price));

      progress3(three_upgrade_supply_limit_stage,pb_three_upgrade_supply_limit,pb_three_supply_indicator,label);

      actions++;ActionsUpdate();

      InventoryUpdate();

    });
    three_upgrade_effectiveness.click(function(){

      var label;

      PlayAudio(2);

      three_ratios_flag=1;

      money-=three_upgrade_effectiveness_price;

      three_upgrade_effectiveness_stage+=4;
      if(three_upgrade_effectiveness_stage==100){

        if(three_upgrade_effectiveness_level % 2 === 0){three_upgrade_effectiveness_stage=0;three_multiplier=three_multiplier*100;}
        else{three_upgrade_effectiveness_stage=0;three_multiplier=three_multiplier*5;}

        three_upgrade_effectiveness_level++;

      }
      else{three_multiplier+=three_init_multiplier;}

      if(three_upgrade_effectiveness_stage==96){//multipliers

        if(three_upgrade_effectiveness_level % 2 === 0){label="x100";}
        else{label="x5";}

      }
      else{label="+"+numT(three_init_multiplier);}

      three_upgrade_effectiveness_price= Math.floor(three_upgrade_effectiveness_price + three_upgrade_effectiveness_price*egr);
      three_upgrade_effectiveness.text("⌬" + numT(three_upgrade_effectiveness_price));

      if(Math.floor(three_upgrade_effectiveness_price + three_upgrade_effectiveness_price*egr)>three_upgrade_generation_price){
        three_upgrade_effectiveness.css("visibility", "hidden").blur();
      }

      if(three_upgrade_effectiveness_price>three_upgrade_generation_price){
        three_upgrade_generation_price = three_upgrade_effectiveness_price;
        three_upgrade_generation.text("⌬" + numT(three_upgrade_generation_price));
      }

      progress3(three_upgrade_effectiveness_stage,pb_three_upgrade_effectiveness,pb_three_effectiveness_indicator,label);

      actions++;ActionsUpdate();

      three_effectiveness_label.text("["+numT(three_multiplier)+"]");
      InventoryUpdate();

    });
    three_upgrade_generation.click(function(){

      var label;

      PlayAudio(2);

      //incrementing generation
      three_generation++;

      //to make sure we will recalculate ratios when we start this generator
      three_ratios_flag=1;

      money-=three_upgrade_generation_price;

      //generating generator multiplier
      three_init_multiplier=three_init_multiplier*100000000;
      //three_multiplier=three_init_multiplier;

      //NEW
      three_multiplier=three_multiplier*100;

      //effectiveness price
      three_upgrade_effectiveness_price= Math.floor(three_upgrade_generation_price);
      three_upgrade_effectiveness.text("⌬" + numT(three_upgrade_effectiveness_price));
      //supply limit price
      three_upgrade_supply_limit_price= Math.floor(three_upgrade_generation_price);
      three_upgrade_supply_limit.text("⌬" + numT(three_upgrade_supply_limit_price));

      //resetting the generator
      three_x=0;g_nuclear.css('background-position', + three_x + 'px 0px');
      clearInterval(three_interval);

      //resetting effectiveness
      three_upgrade_effectiveness_stage=0;
      three_upgrade_effectiveness_level=1;

      three_effectiveness_label.text("["+numT(three_multiplier)+"]");
      label="+"+numT(three_init_multiplier);
      progress3(three_upgrade_effectiveness_stage,pb_three_upgrade_effectiveness,pb_three_effectiveness_indicator,label);

      //resetting supply
      three_upgrade_supply_limit_stage=0;
      three_supply=0;three_supply_label.text(three_supply);
      three_price=1;
      button_three.text(numT(three_price));
      button1Enable(button_three);

      progress3(0,pb_three_upgrade_supply_limit,pb_three_supply_indicator,"+1");

      //generator generation price
      three_upgrade_generation_price= three_upgrade_generation_price*Math.pow(10,14);
      three_upgrade_generation.text("⌬" + numT(three_upgrade_generation_price));

      //other updates
      actions++;ActionsUpdate();
      three_generation_label.text("Generation " + romanize(three_generation+1));
      three_name_label.text("Nuclear " + romanize(three_generation));
      three_upgrade_effectiveness.css("visibility", "visible");
      InventoryUpdate();

    });


    four_upgrade_supply_limit.click(function(){

      var label;

      PlayAudio(2);

      money-=four_upgrade_supply_limit_price;

      if(four_price==0){button1Enable(button_four);}

      four_upgrade_supply_limit_stage+=20;
      if(four_upgrade_supply_limit_stage==100){four_upgrade_supply_limit_stage=0;four_price=four_price*2;}
      else{four_price++;}
      if(four_upgrade_supply_limit_stage==80){label="x2";}
      else{label="+1";}


      button_four.text(numT(four_price));

      four_upgrade_supply_limit_price= Math.floor(four_upgrade_supply_limit_price + four_upgrade_supply_limit_price*(sgr-animal4_supply_price_reduction));
      four_upgrade_supply_limit.text("⌬" + numT(four_upgrade_supply_limit_price));

      progress3(four_upgrade_supply_limit_stage,pb_four_upgrade_supply_limit,pb_four_supply_indicator,label);

      actions++;ActionsUpdate();

      InventoryUpdate();

    });
    four_upgrade_effectiveness.click(function(){

      var label;

      PlayAudio(2);

      four_ratios_flag=1;

      money-=four_upgrade_effectiveness_price;

      four_upgrade_effectiveness_stage+=4;
      if(four_upgrade_effectiveness_stage==100){

        if(four_upgrade_effectiveness_level % 2 === 0){four_upgrade_effectiveness_stage=0;four_multiplier=four_multiplier*100;}
        else{four_upgrade_effectiveness_stage=0;four_multiplier=four_multiplier*5;}

        four_upgrade_effectiveness_level++;

      }
      else{four_multiplier+=four_init_multiplier;}

      if(four_upgrade_effectiveness_stage==96){//multipliers

        if(four_upgrade_effectiveness_level % 2 === 0){label="x100";}
        else{label="x5";}

      }
      else{label="+"+numT(four_init_multiplier);}

      four_upgrade_effectiveness_price= Math.floor(four_upgrade_effectiveness_price + four_upgrade_effectiveness_price*egr);
      four_upgrade_effectiveness.text("⌬" + numT(four_upgrade_effectiveness_price));

      if(Math.floor(four_upgrade_effectiveness_price + four_upgrade_effectiveness_price*egr)>four_upgrade_generation_price){
        four_upgrade_effectiveness.css("visibility", "hidden").blur();
      }

      if(four_upgrade_effectiveness_price>four_upgrade_generation_price){
        four_upgrade_generation_price = four_upgrade_effectiveness_price;
        four_upgrade_generation.text("⌬" + numT(four_upgrade_generation_price));
      }

      progress3(four_upgrade_effectiveness_stage,pb_four_upgrade_effectiveness,pb_four_effectiveness_indicator,label);

      actions++;ActionsUpdate();

      four_effectiveness_label.text("["+numT(four_multiplier)+"]");
      InventoryUpdate();

    });
    four_upgrade_generation.click(function(){

      var label;

      PlayAudio(2);

      //incrementing generation
      four_generation++;

      //to make sure we will recalculate ratios when we start this generator
      four_ratios_flag=1;

      money-=four_upgrade_generation_price;

      //generating generator multiplier
      four_init_multiplier=four_init_multiplier*100000000;
      //four_multiplier=four_init_multiplier;

      //NEW
      four_multiplier=four_multiplier*100;

      //effectiveness price
      four_upgrade_effectiveness_price= Math.floor(four_upgrade_generation_price);
      four_upgrade_effectiveness.text("⌬" + numT(four_upgrade_effectiveness_price));
      //supply limit price
      four_upgrade_supply_limit_price= Math.floor(four_upgrade_generation_price);
      four_upgrade_supply_limit.text("⌬" + numT(four_upgrade_supply_limit_price));

      //resetting the generator
      four_x=0;g_gravity.css('background-position', + four_x + 'px 0px');
      clearInterval(four_interval);

      //resetting effectiveness
      four_upgrade_effectiveness_stage=0;
      four_upgrade_effectiveness_level=1;

      four_effectiveness_label.text("["+numT(four_multiplier)+"]");
      label="+"+numT(four_init_multiplier);
      progress3(four_upgrade_effectiveness_stage,pb_four_upgrade_effectiveness,pb_four_effectiveness_indicator,label);

      //resetting supply
      four_upgrade_supply_limit_stage=0;
      four_supply=0;four_supply_label.text(four_supply);
      four_price=1;
      button_four.text(numT(four_price));
      button1Enable(button_four);

      progress3(0,pb_four_upgrade_supply_limit,pb_four_supply_indicator,label);

      //generator generation price
      four_upgrade_generation_price= four_upgrade_generation_price*Math.pow(10,14);
      four_upgrade_generation.text("⌬" + numT(four_upgrade_generation_price));

      //other updates
      actions++;ActionsUpdate();
      four_generation_label.text("Generation " + romanize(four_generation+1));
      four_name_label.text("Gravity " + romanize(four_generation));
      four_upgrade_effectiveness.css("visibility", "visible");
      InventoryUpdate();

    });

    //MACHINES

    //battery
    battery_unlock_upgrade.click(function(){

      PlayAudio(2);

      money-=battery_unlock_upgrade_price;


      //default parameters
      batteryInit();

      InventoryUpdate();

    });
    battery_percent_up.click(function(){



      if(battery_charge_percentage<battery_charge_percentage_limit){
        PlayAudio(7);
        battery_charge_percentage++;
        battery_charge_percentage_label.text(battery_charge_percentage+"%");
      }

      if(battery_charge_percentage>=10){
        furnace_screen.removeClass('furnace_screen_dim').addClass('furnace_screen_lit');

        clearInterval(furnace_cooling_timer);
        furnace_cooling_timer = null;// release our intervalID from the variable; otherwise it will not pass the if(!furnace_cooling_timer) check in battery_percent_down.click()
      }

    });
    battery_percent_down.click(function(){



      if(battery_charge_percentage>0){
        PlayAudio(7);
        battery_charge_percentage--;
        battery_charge_percentage_label.text(battery_charge_percentage+"%");
        if(battery_charge_percentage==0){
          battery_effectiveness_label.text("[⑂0]");
        }
      }

      if(battery_charge_percentage<10){

        furnace_screen.removeClass('furnace_screen_lit').addClass('furnace_screen_dim');

          foundry_production_flag=0;

          if(!furnace_cooling_timer){//prevents from launching the interval twice
            furnace_cooling_timer=setInterval(function() {

              foundry_temperature-=getRandomInt(0,5);
              if(foundry_temperature<=0){foundry_temperature=0;clearInterval(furnace_cooling_timer);furnace_cooling_timer = null;}
              furnace_screen.text(foundry_temperature+" °C");

            }, 1000);
          }


      }

    });

    charge_limit_upgrade.click(function(){

      PlayAudio(2);

      charge-=charge_limit_upgrade_price;
      charge_limit=Math.floor(charge_limit*1.5);

      charge_limit_upgrade_price= Math.floor(charge_limit_upgrade_price + charge_limit_upgrade_price*0.5);
      charge_limit_upgrade.text("⑂" + numT(charge_limit_upgrade_price));

      charge_limit_label.text("["+numT(charge_limit)+"]");

      ChargeUpdate();

    });
    charge_throughput_upgrade.click(function(){

      PlayAudio(2);

      charge-=charge_throughput_upgrade_price;
      battery_charge_percentage_limit++;

      if(battery_charge_percentage_limit>=100){
        charge_throughput_upgrade.hide();

                          if(charge_throughput_magicnumber_flag==0 && battery_charge_percentage_limit>=100){
                            charge_throughput_magicnumber_flag=1;
                            magicnumber++;
                            magicnumber_label.text("["+magicnumber+"]");
                          }
      }

      //a dramatic rise in the price, because we want the percentage to continue to be pretty low
      charge_throughput_upgrade_price= Math.floor(charge_throughput_upgrade_price*20);
      charge_throughput_upgrade.text("⑂" + numT(charge_throughput_upgrade_price));

      charge_throughput_label.text("["+battery_charge_percentage_limit+"%]");

      ChargeUpdate();

    });

    //magnetron
    magnetron_unlock_upgrade.click(function(){

      PlayAudio(2);

      charge-=magnetron_unlock_upgrade_price;

      //default parameters
      magnetronInit();

      ChargeUpdate();

    });
    magnetron_button.click(function(){//the big magnetron button

      var num=0;
      PlayAudio(5);


      magnetron_multiplier=(device_magnetron_multiplier+animal3_magnetron_multiplier);
      pb_money_indicator.css("background-color","#f48c37");

      magnetron_buttonActiveDisabled();
      magnetron_button.text((magnetron_duration+animal2_magnetron_duration)+" sec");

      magnetron_interval=setInterval(function() {

        num++;
        magnetron_button.text(parseInt((magnetron_duration+animal2_magnetron_duration)-num)+" sec");

        if(num>=(magnetron_duration+animal2_magnetron_duration)){
          magnetron_multiplier=1;
          magnetron_state=1;//back to non-armed state
          pb_money_indicator.css("background-color","#c149ff");
          magnetron_button.text("x"+(device_magnetron_multiplier+animal3_magnetron_multiplier));
          magnetron_buttonDisable();
          clearInterval(magnetron_interval);
        }


      }, 1000);

    });

    magnetron_multiplier_upgrade.click(function(){

      PlayAudio(2);

      charge-=magnetron_multiplier_upgrade_price;

      device_magnetron_multiplier++;

      magnetron_multiplier_upgrade_price=magnetron_multiplier_upgrade_price*5;
      magnetron_multiplier_upgrade.text("⑂" + numT(magnetron_multiplier_upgrade_price));

      magnetron_multiplier_label.text("[x"+device_magnetron_multiplier+"]");
      //so that we upgrade the button only when magnetron is not running. when it is, the timer is displayed on the button instead
      if(magnetron_multiplier==1){magnetron_button.text("x"+(device_magnetron_multiplier+animal3_magnetron_multiplier));}


      if(device_magnetron_multiplier>=warp_max_magnetron_multiplier){magnetron_multiplier_upgrade.hide();}



      ChargeUpdate();

    });
    magnetron_duration_upgrade.click(function(){

      PlayAudio(2);

      charge-=magnetron_duration_upgrade_price;

      magnetron_duration+=5;

      magnetron_duration_upgrade_price= magnetron_duration_upgrade_price*3;
      magnetron_duration_upgrade.text("⑂" + numT(magnetron_duration_upgrade_price));

      magnetron_duration_label.text("["+(magnetron_duration)+" sec]");

      if(magnetron_duration>=warp_max_magnetron_duration){magnetron_duration_upgrade.hide();}

      ChargeUpdate();

    });

    //engden
    auxiliary_lever1.mousemove(function(){
        var avalue;
        auxiliary_effectiveness1=5-Math.abs( Math.floor(auxiliary_lever1.val()/10) );//we need Math.abs because the lever has negative values -50 ... 50
        auxiliary_effectiveness=1+(auxiliary_effectiveness1+auxiliary_effectiveness2)*0.01;
        //console.log(auxiliary_effectiveness);
        auxiliary_effectiveness_label.text("[+"+(auxiliary_effectiveness1+auxiliary_effectiveness2)+"%]");
    });
    auxiliary_lever2.mousemove(function(){
        var avalue;
        auxiliary_effectiveness2=5-Math.abs( Math.ceil(auxiliary_lever2.val()/10) );
        auxiliary_effectiveness=1+(auxiliary_effectiveness1+auxiliary_effectiveness2)*0.01;
        //console.log(auxiliary_effectiveness);
        auxiliary_effectiveness_label.text("[+"+(auxiliary_effectiveness1+auxiliary_effectiveness2)+"%]");
    });

    //foundry
    foundry_unlock_upgrade.click(function(){

      PlayAudio(2);

      charge-=foundry_unlock_upgrade_price;


      //default parameters
      foundryInit();

      ChargeUpdate();

    });
    foundry_components_cycle_upgrade.click(function(){

      var label;

      PlayAudio(2);

      charge-=foundry_components_cycle_upgrade_price;

      fccu_stage+=5;
      if(fccu_stage==100){

        if(fccu_level % 2 === 0){fccu_stage=0;foundry_components_multiplier=foundry_components_multiplier*100;}
        else{fccu_stage=0;foundry_components_multiplier=foundry_components_multiplier*5;}

        fccu_level++;

      }
      else{foundry_components_multiplier+=1;}
      if(fccu_stage==95){

        if(fccu_level % 2 === 0){label="x100";}
        else{label="x5";}

      }
      else{label="+1";}

      progress3(fccu_stage,pb_components_multiplier,pb_components_multiplier_indicator,label);

      foundry_components_cycle_upgrade_price = foundry_components_cycle_upgrade_price*1.15;
      foundry_components_cycle_upgrade.text("⑂" + numT(foundry_components_cycle_upgrade_price));

      foundry_components_multiplier_label.text("["+numT(foundry_components_multiplier)+"]");

      ChargeUpdate();

    });

    //shuttlebay
    shuttlebay_unlock_upgrade.click(function(){

      PlayAudio(2);

      foundry_components-=shuttlebay_unlock_upgrade_price;
      foundry_components_label.text("⯎" + numT(foundry_components));


      //default parameters
      shuttlebayInit();

      factoryState();

    });
    build_shuttle_upgrade.click(function(){

      var label;

      foundry_components-=build_shuttle_upgrade_price;
      foundry_components_label.text("⯎" + numT(foundry_components));

      bsu_stage+=4;
      if(bsu_stage==100){

        PlayAudio(8);

        bsu_stage=0;
        let shuttles_already_built=shuttlesBuiltCheck();
        shuttle_fleet['availability'][shuttles_already_built]=1;
        drawShuttles();

        if(shuttlesBuiltCheck()>=5){
          build_shuttle_row.hide();
        }

      }else{
        PlayAudio(2);
      }

      label=bsu_stage+'%';
      if(bsu_stage==0){label='';}

      progress3(bsu_stage,pb_build_shuttle,pb_build_shuttle_indicator,label);

      build_shuttle_upgrade_price = build_shuttle_upgrade_price*1.25;
      build_shuttle_upgrade.text("⯎" + numT(build_shuttle_upgrade_price));

      factoryState();

    });
    shuttle_capacity_upgrade.click(function(){

      PlayAudio(2);

      foundry_components-=shuttle_capacity_upgrade_price;
      foundry_components_label.text("⯎" + numT(foundry_components));

      shuttle_capacity_upgrade_price = shuttle_capacity_upgrade_price*1.15;
      shuttle_capacity_upgrade.text("⯎" + numT(shuttle_capacity_upgrade_price));

      shuttle_capacity+=100;
      shuttle_capacity_upgrade_label.text("["+numT(shuttle_capacity)+"]");

      if(shuttle_capacity_magicnumber_flag==0 && shuttle_capacity==100000){
        shuttle_capacity_magicnumber_flag=1;
        magicnumber++;
        magicnumber_label.text("["+magicnumber+"]");
      }

      factoryState();

    });
    repair_shuttle_upgrade.click(function(){


      PlayAudio(2);

      foundry_components-=repair_shuttle_upgrade_price;
      foundry_components_label.text("⯎" + numT(foundry_components));

      rsu_stage+=25;
      if(rsu_stage==100){

        rsu_stage=0;

      }

      progress3(rsu_stage,pb_repair_shuttle,pb_repair_shuttle_indicator);

      repair_shuttle_upgrade_price = repair_shuttle_upgrade_price*1.5;
      repair_shuttle_upgrade.text("⯎" + numT(repair_shuttle_upgrade_price));

      factoryState();

    });

    //mission control
    mc_unlock_upgrade.click(function(){

      PlayAudio(2);

      //default parameters
      mcInit();

      factoryState();

    });
    mission_debris_launch.click(function(){

      PlayAudio(2);

      mission_debris_launch_flag=1;

      mission_debris_launch.hide();
      mission_debris_block_progress.show();
      redToGreen(mission_debris_upgrade_label);

      takeShuttle(101);
      mission_debris_shuttle_name.text('"'+obtainShuttleName(101)+'"');

      factoryState();



    });
    mission_station_launch.click(function(){

      PlayAudio(2);

      mission_station_launch_flag=1;

      mission_station_launch.hide();
      mission_station_block_progress.show();
      redToGreen(mission_station_upgrade_label);

      takeShuttle(102);
      mission_station_shuttle_name.text('"'+obtainShuttleName(102)+'"');

      factoryState();



    });
    mission_station_upgrade.click(function(){

      foundry_components-=mission_station_upgrade_price;
      foundry_components_label.text("⯎" + numT(foundry_components));


      mission_station_upgrade_price = mission_station_upgrade_price*1.1;
      mission_station_upgrade.text("⯎" + numT(mission_station_upgrade_price));

      mission_station_stage+=25;//was 20
      if(mission_station_stage==100){

        PlayAudio(8);

        mission_station_stage=0;
        mission_station_status+=1;

        if(mission_station_status>=100){
          mission_station_status=100;
          mission_station_block_progress.hide();
          mission_station_upgrade_label.text("Mission complete");
          station_unlock_upgrade.html(mission_station_status+'%');
          mission_station_launch_flag=2;
          returnShuttle(102);
        }else{
          mission_station_upgrade_label.text("Deployment status: " + mission_station_status + '%');
          station_unlock_upgrade.html(mission_station_status+'%');
        }

      }else{PlayAudio(2);}

      progress3(mission_station_stage,pb_mission_station,pb_mission_station_indicator,'');

      factoryState();

    });
    mission_telescope_launch.click(function(){

      PlayAudio(2);

      mission_telescope_launch_flag=1;

      mission_telescope_launch.hide();
      mission_telescope_block_progress.show();
      redToGreen(mission_telescope_upgrade_label);

      takeShuttle(103);
      mission_telescope_shuttle_name.text('"'+obtainShuttleName(103)+'"');

      factoryState();



    });
    mission_telescope_upgrade.click(function(){

      foundry_components-=mission_telescope_upgrade_price;
      foundry_components_label.text("⯎" + numT(foundry_components));


      mission_telescope_upgrade_price = mission_telescope_upgrade_price*1.1;
      mission_telescope_upgrade.text("⯎" + numT(mission_telescope_upgrade_price));

      mission_telescope_stage+=25;
      if(mission_telescope_stage==100){

        PlayAudio(8);

        mission_telescope_stage=0;
        mission_telescope_status+=1;

        if(mission_telescope_status>=100){
          mission_telescope_status=100;
          mission_telescope_block_progress.hide();
          mission_telescope_upgrade_label.text("Mission complete");
          telescope_unlock_upgrade.html(mission_telescope_status+'%');
          mission_telescope_launch_flag=2;
          returnShuttle(103);
        }else{
          mission_telescope_upgrade_label.text("Deployment status: " + mission_telescope_status + '%');
          telescope_unlock_upgrade.html(mission_telescope_status+'%');
        }

      }else{PlayAudio(2);}

      progress3(mission_telescope_stage,pb_mission_telescope,pb_mission_telescope_indicator,'');

      factoryState();

    });

    //space station
    station_unlock_upgrade.click(function(){

      PlayAudio(2);

      //default parameters
      stationInit();

      //not doing factoryState() because not paying for unlock (paid for by deploy)
      //factoryState();

    });

    //orbital telescope
    telescope_unlock_upgrade.click(function(){

      PlayAudio(2);

      //default parameters
      telescopeInit();

      //not doing factoryState() because not paying for unlock (paid for by deploy)
      //factoryState();

    });
    telescope_resolution_upgrade.click(function(){

      PlayAudio(2);

      foundry_components-=telescope_resolution_upgrade_price;
      foundry_components_label.text("⯎" + numT(foundry_components));

      telescope_resolution_upgrade_price*=1.1;
      telescope_resolution_upgrade.text( "⯎" +  numT(telescope_resolution_upgrade_price) );

      telescope_resolution+=100;
      telescope_resolution_label.text('[1-'+telescope_resolution+']');

    });



  });//document.ready






  function Init(){

    //PLAYER
    money=0;
    total_money=0;//we reset total_money, but all_time_money is preserved from previous cycles
    antimatter=0;antimatter_label.text(numT(antimatter));//resetting antimatter, which is the amount of antimatter generated this cycle;


    actions=0;
    button2Disable(actions_upgrade);

    //research lab
    actions_cycle=0;//currently unused
    bonus_multiplier=1;//resetting the bonus multiplier

    magicnumber_label.text("["+magicnumber+"]");

    last_animal=999;//default value, to not trigger any lifeform boxes
    buildLifeformsCollection();

    //GENERATOR PRICES (SUPPLY LIMITS)
    one_price=1;button_one.text(numT(one_price));
    two_price=0;button_two.text(numT(two_price));
    three_price=0;button_three.text(numT(three_price));
    four_price=0;button_four.text(numT(four_price));

    //each next is x100. The prestige multiplier is ever only applied here
    one_init_multiplier=1*prestige_multiplier;
    two_init_multiplier=100*prestige_multiplier;
    three_init_multiplier=10000*prestige_multiplier;
    four_init_multiplier=1000000*prestige_multiplier;

    //MULTIPLIERS
    one_multiplier=one_init_multiplier;one_effectiveness_label.text("["+numT(one_multiplier)+"]");
    two_multiplier=two_init_multiplier;two_effectiveness_label.text("["+numT(two_multiplier)+"]");
    three_multiplier=three_init_multiplier;three_effectiveness_label.text("["+numT(three_multiplier)+"]");
    four_multiplier=four_init_multiplier;four_effectiveness_label.text("["+numT(four_multiplier)+"]");

    one_recent_money=0;
    two_recent_money=0;
    three_recent_money=0;
    four_recent_money=0;

    //pbs
    progress3(0,pb_one_upgrade_supply_limit,pb_one_supply_indicator,"+1");
    progress3(0,pb_one_upgrade_effectiveness,pb_one_effectiveness_indicator,"+"+numT(one_init_multiplier));

    progress3(0,pb_two_upgrade_supply_limit,pb_two_supply_indicator,"+1");
    progress3(0,pb_two_upgrade_effectiveness,pb_two_effectiveness_indicator,"+"+numT(two_init_multiplier));

    progress3(0,pb_three_upgrade_supply_limit,pb_three_supply_indicator,"+1");
    progress3(0,pb_three_upgrade_effectiveness,pb_three_effectiveness_indicator,"+"+numT(three_init_multiplier));

    progress3(0,pb_four_upgrade_supply_limit,pb_four_supply_indicator,"+1");
    progress3(0,pb_four_upgrade_effectiveness,pb_four_effectiveness_indicator,"+"+numT(four_init_multiplier));

    //generator strips
    one_x=0;two_x=0;three_x=0;four_x=0;
    g_electric.css('background-image', 'url("img/g_electric2.png")');
    g_plasma.css('background-image', 'url("img/g_plasma2.png")');
    g_nuclear.css('background-image', 'url("img/g_nuclear2.png")');
    g_gravity.css('background-image', 'url("img/g_gravity2.png")');

    //LOOPS
    clearInterval(one_interval);
    clearInterval(two_interval);
    clearInterval(three_interval);
    clearInterval(four_interval);

    //UPGRADES DEFAULTS
    money_limit=money_limit_init;money_limit_label.text("["+numT(money_limit)+"]");
    one_supply=0;one_supply_label.text(one_supply);
    two_supply=0;two_supply_label.text(two_supply);
    three_supply=0;three_supply_label.text(three_supply);
    four_supply=0;four_supply_label.text(four_supply);

    one_generation=1;one_generation_label.text("Generation II");one_name_label.text("Electric");
    two_generation=1;two_generation_label.text("Generation II");two_name_label.text("Plasma");
    three_generation=1;three_generation_label.text("Generation II");three_name_label.text("Nuclear");
    four_generation=1;four_generation_label.text("Generation II");four_name_label.text("Gravity");

    one_ratio_label.text("0%");
    two_ratio_label.text("0%");
    three_ratio_label.text("0%");
    four_ratio_label.text("0%");

    //generator prices (each next is x1000)

    one_upgrade_supply_limit_price=10;one_upgrade_supply_limit.text("⌬" + numT(one_upgrade_supply_limit_price));
    one_upgrade_effectiveness_price=10;one_upgrade_effectiveness.text("⌬" + numT(one_upgrade_effectiveness_price));
    one_upgrade_effectiveness.css("visibility", "visible");

    two_upgrade_supply_limit_price=one_upgrade_supply_limit_price*500;two_upgrade_supply_limit.text("⌬" + numT(two_upgrade_supply_limit_price));
    two_upgrade_effectiveness_price=one_upgrade_effectiveness_price*500;two_upgrade_effectiveness.text("⌬" + numT(two_upgrade_effectiveness_price));
    two_upgrade_effectiveness.css("visibility", "visible");

    three_upgrade_supply_limit_price=two_upgrade_supply_limit_price*500;three_upgrade_supply_limit.text("⌬" + numT(three_upgrade_supply_limit_price));
    three_upgrade_effectiveness_price=two_upgrade_effectiveness_price*500;three_upgrade_effectiveness.text("⌬" + numT(three_upgrade_effectiveness_price));
    three_upgrade_effectiveness.css("visibility", "visible");

    four_upgrade_supply_limit_price=three_upgrade_supply_limit_price*500;four_upgrade_supply_limit.text("⌬" + numT(four_upgrade_supply_limit_price));
    four_upgrade_effectiveness_price=three_upgrade_effectiveness_price*500;four_upgrade_effectiveness.text("⌬" + numT(four_upgrade_effectiveness_price));
    four_upgrade_effectiveness.css("visibility", "visible");

    //generator generations (each next is x1000)
    one_upgrade_generation_price=four_upgrade_effectiveness_price*1000;one_upgrade_generation.text("⌬" + numT(one_upgrade_generation_price));
    two_upgrade_generation_price=one_upgrade_generation_price*1000;two_upgrade_generation.text("⌬" + numT(two_upgrade_generation_price));
    three_upgrade_generation_price=two_upgrade_generation_price*1000;three_upgrade_generation.text("⌬" + numT(three_upgrade_generation_price));
    four_upgrade_generation_price=three_upgrade_generation_price*1000;four_upgrade_generation.text("⌬" + numT(four_upgrade_generation_price));

    money_limit_upgrade_price=money_limit_upgrade_price_init;money_limit_upgrade.text("⌬" + numT(money_limit_upgrade_price));

    //UPGRADE STAGES
    one_upgrade_supply_limit_stage=0;
    one_upgrade_effectiveness_stage=0;
    one_upgrade_effectiveness_level=1;//after a certain amount does x5 and x100

    two_upgrade_supply_limit_stage=0;
    two_upgrade_effectiveness_stage=0;
    two_upgrade_effectiveness_level=1;

    three_upgrade_supply_limit_stage=0;
    three_upgrade_effectiveness_stage=0;
    three_upgrade_effectiveness_level=1;

    four_upgrade_supply_limit_stage=0;
    four_upgrade_effectiveness_stage=0;
    four_upgrade_effectiveness_level=1;

    //GENERATOR BUTTONS
    button1Enable(button_one);
    button1Disable(button_two);
    button1Disable(button_three);
    button1Disable(button_four);

    //CONTROL PANEL
    one_tab.css("background-color","#30b8d0");one_tab.css("color","#1a1a1a");
    two_tab.css("background-color","#1a1a1a");two_tab.css("color","#999");
    three_tab.css("background-color","#1a1a1a");three_tab.css("color","#999");
    four_tab.css("background-color","#1a1a1a");four_tab.css("color","#999");

    one_tab_contents.show();
    two_tab_contents.hide();
    three_tab_contents.hide();
    four_tab_contents.hide();

    //MACHINES
    //Machine states (only those that are not set through prestige; engden_state and lscanner_state are handled later)
    battery_state=0;
    magnetron_state=0;
    foundry_state=0;
    shuttlebay_state=0;
    mc_state=0;
    station_state=0;
    telescope_state=0;

    //BATTERY
    battery_unlock_upgrade_price=Math.pow(10,13);battery_unlock_upgrade.text("⌬" + numT(battery_unlock_upgrade_price));

    //ENGDEN
    //default values are required, so that when you do mouseover, it won't do NaN
    auxiliary_effectiveness=1;//this is also required, since it is part of moneyCalc()
    auxiliary_effectiveness1=0;
    auxiliary_effectiveness2=0;

    if(engden_state==0){
      engden_title.hide();
      engden_block.hide();
      rank_label.text("[Operator]");
    }else{
      engden_title.show();
      engden_block.show();
      rank_label.text("[Engineer]");
    }

    if(lscanner_state==0){
      lscanner_title.hide();
      lscanner_block.hide();
      rank_label.text("[Operator]");
    }else{
      lscanner_title.show();
      lscanner_block.show();
      rank_label.text("[Floor Admin]");
    }

    if(chief==1){
      rank_label.text("[Chief Engineer]");
    }

    //Init codes of the machines themselves are currently in each of the unlock events, since initially all machines are hidden and/or locked. Here we list those variables that affect the generators, so that they are reset after prestige
    battery_block.hide();
    battery_lock_block.show();
    magnetron_block.hide();
    magnetron_lock_block.hide();
    foundry_block.hide();
    foundry_lock_block.hide();
    shuttlebay_block.hide();
    shuttlebay_lock_block.hide();
    mc_block.hide();
    mc_lock_block.hide();
    station_block.hide();
    station_lock_block.hide();
    telescope_block.hide();
    telescope_lock_block.hide();
    battery_charge_percentage=0;//has to be 0 by default, because it is part of the moneyCalc() function all the time;
    magnetron_multiplier=1;//has to be 1 by default, because it is part of the moneyCalc() formula all the time;
    pb_money_indicator.css("background-color","#c149ff");//and setting the money indicator back to its normal color

    //OPTIMIZATIONS
    active_tab_flag=1;
    one_ratios_flag=1;//1 by default, so that starting the generator recalculates the ratios
    two_ratios_flag=1;
    three_ratios_flag=1;
    four_ratios_flag=1;

    //PRESTIGE
    button2Enable(prestige_upgrade);

    //researchList
    researchList={
      price:['500','1000','2000','4000','8000','16000','32000','64000'],
      effect:['1','2','2','1','2','2','1','3'],
        type:['1','1','1','1','2','1','1','1']
    };
    buildResearchList();

    //updating UI with the established values
    InventoryUpdate();
    ActionsUpdate();

    //starting the Grand Telescope
    startTelescope();

    //hiding UI elements
    closeWindows();

    //we actually don't save here, reason being - I want to give the player a chance to reload after a prestige reboot in case they made a mistake. This means that when you prestige (meaning, presss the "Reboot" button), you will now actually have 2 full minutes to decide to revert your prestige upgrades
    //SaveGame();

    clearInterval(save_timer);
    save_timer_label.text(120);
    button3Disable(save_upgrade);
    setTimeout('SaveLoop();',1000);//commented out for testing


  }

  function moneyCalc(m_inc){/*this is where we properly add m_inc - money increment*/
    //find the valid increment which does not go beyond money_limit
    /*
    The reason why we're doing money=money_limit and not simply money+=m_inc like in other places, is because I've found that with higher order numbers precision will begin to lapse, probably due to Math.floor being applied in various places. Which will eventually lead to money never being equal to money_limit. Therefore, it's safer to simply set money to money_limit.
    */

    m_inc=m_inc*magnetron_multiplier*auxiliary_effectiveness*(bonus_multiplier+animal1_bonus_multiplier);//where various multipliers are applied

    if( money+m_inc>money_limit ){
      m_inc=money_limit-money;money=money_limit;
    }else{money+=m_inc;}

    total_money+=m_inc;all_time_money+=m_inc;

    //charging the battery
    if(battery_charge_percentage>0 && money!=money_limit){//we don't charge if the generators are running idle

      let charge_increment=m_inc * (battery_charge_percentage*0.01);//100
      //removing that amount from the generated energy (money)
      money-=charge_increment;
      //and then multiplying by 0.0000001 (normalizing for battery)
      charge_increment = Math.floor( charge_increment*animal7_battery_charge_multiplier*0.0000001 );


      //adding it to the battery's charge
      charge+=charge_increment;
      if(charge>charge_limit){charge=charge_limit;}

        //calculating effectiveness by taking a percentage of all money generated by generator, otherwise the effectiveness is going to flash from one value to the other, since in reality almost never would the charges from different generators arrive at the same time
        let all = Math.floor( ((one_recent_money + two_recent_money + three_recent_money + four_recent_money) * (battery_charge_percentage/100)*0.0000001*animal7_battery_charge_multiplier) );
        battery_effectiveness_label.text("[⑂"+numT(all)+"]");

      ChargeUpdate();

      //Calling various machines. This is done here and not in ChargeUpdate(), because ChargeUpdate() is also called when the player is buying factory upgrades and we don't want to trigger these checks in those cases

      //Magnetron
      if(magnetron_state==1){//this is called only when magnetron is unlocked (not 0) and not armed (not 2)
        magnetronRequest();
      }

      //Foundry (running and heating up)
      if(foundry_state==1 && battery_charge_percentage>=10){//foundry furnace heating up

        //moneyCalc() cycles through the foundry_heating_stage, which loops 0-1-2-3;
        //heating up happens at 3
        //components production happens at 2
        if(foundry_production_flag==1 && foundry_heating_stage==2){//if foundry is in production mode
          foundry_components+=Math.floor(foundry_components_multiplier*animal6_components_multiplier);
          foundry_components_label.text("⯎" + numT(foundry_components));
          if(foundry_temperature<0){foundry_temperature=0;}

        }


        if(foundry_heating_stage==3){
          foundry_temperature+=battery_charge_percentage-9;
            if(foundry_temperature>=3000 && foundry_production_flag==0){
              foundry_production_flag=1;
            }
            if(foundry_temperature>3422){
              foundry_temperature = 3422 - getRandomInt(0,23);
            }
          furnace_screen.text(foundry_temperature+" °C");
        }

        foundry_heating_stage++;if(foundry_heating_stage==4){foundry_heating_stage=0;}

      }//foundry furnace heating up

      //Mission Control: Debris
      if(mission_debris_launch_flag==1){
        if(getRandomInt(0,1)==1){
          missionDebris();
        }
      }

      //Orbital Telescope
      if(telescope_state==1){
        telescope_seconds_amount++;
              if(telescope_seconds_amount>=60){
                telescope_seconds_amount=0;
                  telescope_stars_amount+=getRandomInt(1,telescope_resolution);
                        if(telescope_stars_amount>=telescope_stars_amount_limit){
                          telescope_stars_amount=0;
                          PlayAudio(8);
                          telescope_galaxies_amount++;
                          telescope_galaxies_amount_label.text('['+numT(telescope_galaxies_amount)+']');
                          if(telescope_magicnumber_flag==0 && telescope_galaxies_amount==100){
                            telescope_magicnumber_flag=1;
                            magicnumber++;
                            magicnumber_label.text("["+magicnumber+"]");
                          }
                        }

                telescope_stars_amount_label.text('['+telescope_stars_amount+'/1000000000000]');

              }//if(telescope_seconds_amount>=60)
        const secondsDegrees = ((telescope_seconds_amount / 60) * 360) + 90;
        telescope_seconds.css('transform', 'rotate(' + secondsDegrees + 'deg)');
      }


    }//charging the battery

    //Engineering Den
    couplingsWear();

  }

  function One(){

    var num=0;

    one_interval=setInterval(function() {

      num++;

      if(num>=6){

        moneyCalc(one_multiplier);
        one_recent_money=one_multiplier;if(one_ratios_flag==1){one_ratios_flag=0;GeneratorRatios();}
        one_supply-=1;one_supply_label.text(numT(one_supply));

        InventoryUpdate();

        if(audio_mute_one==0){PlayAudio(4);}

        num=0;

        if(one_supply<=0 || money==money_limit){
          clearInterval(one_interval);
          one_supply=0;
          //g_electric.css('background-image', 'url("img/g_electric2.png")');
          button1Enable(button_one);
        }

      }

        //generator belt
        if(money!=money_limit){
          one_x+=1;g_electric.css('background-position', + one_x + 'px 0px');
        }


    }, 80);
  }

  function Two(){

    var num=0;

    two_interval=setInterval(function() {

      num++;


      if(num>=6){

        moneyCalc(two_multiplier);
        two_recent_money=two_multiplier;if(two_ratios_flag==1){two_ratios_flag=0;GeneratorRatios();}
        two_supply-=1;two_supply_label.text(numT(two_supply));

        InventoryUpdate();

        if(audio_mute_two==0){PlayAudio(4);}

        //low-frequency hum of the Plasma generator
        if(getRandomInt(1,1000)==3){PlayAudio(9);}

        num=0;

        if(two_supply<=0 || money==money_limit){
          clearInterval(two_interval);
          two_supply=0;
          button1Enable(button_two);
        }

      }

      if(money!=money_limit){
        two_x+=1;g_plasma.css('background-position', + two_x + 'px 0px');
      }

    }, 80);
  }

  function Three(){

    var num=0;

    three_interval=setInterval(function() {

      num++;


      if(num>=6){

        moneyCalc(three_multiplier);
        three_recent_money=three_multiplier;if(three_ratios_flag==1){three_ratios_flag=0;GeneratorRatios();}
        three_supply-=1;three_supply_label.text(numT(three_supply));

        InventoryUpdate();

        if(audio_mute_three==0){PlayAudio(4);}

        num=0;

        if(three_supply<=0 || money==money_limit){
          clearInterval(three_interval);
          three_supply=0;
          button1Enable(button_three);
        }

      }

      if(money!=money_limit){
      three_x+=1;g_nuclear.css('background-position', + three_x + 'px 0px');
      }

    }, 80);
  }

  function Four(){

    var num=0;

    four_interval=setInterval(function() {

      num++;


      if(num>=6){

        moneyCalc(four_multiplier);
        four_recent_money=four_multiplier;if(four_ratios_flag==1){four_ratios_flag=0;GeneratorRatios();}
        four_supply-=1;four_supply_label.text(numT(four_supply));

        InventoryUpdate();

        if(audio_mute_four==0){PlayAudio(4);}

        num=0;

        if(four_supply<=0 || money==money_limit){
          clearInterval(four_interval);
          four_supply=0;
          button1Enable(button_four);
        }

      }

      if(money!=money_limit){
      four_x+=1;g_gravity.css('background-position', + four_x + 'px 0px');
      }

    }, 80);
  }

  function InventoryUpdate(){

    nAC();//nextAntimatterCost

    storeState();
    progress_money();

    //stats go here, after all checks, so that in case something gets updated later, an incorrect value does not flash here, like when antimatter is not yet set to antimatter++;
    if(stats_window_flag==1){
      all_time_money_label.text("⌬" + numT(all_time_money));
          if(lscanner_state==1){
            total_money_label.text("⌬" + numT(total_money) + " ("+(Math.floor(antimatter/antimatter_cubes*100))+"%)");
          }else{
            total_money_label.text("⌬" + numT(total_money));
          }
      tillNextAntimatter_label.text("⌬" + numT( nextAntimatterCost - all_time_money ) );
      ac_stock_label.text(numT(antimatter_cubes-antimatter_cubes_spent));
    }

  }

  function ChargeUpdate(){
    factoryState();
    progress_battery();
  }

  function ActionsUpdate(){

    if(actions>=actions_limit){
      actions=actions_limit;
      button2Enable(actions_upgrade);
    }

    actions_label.text("["+actions+"/"+actions_limit+"]");
  }

  function storeState(){

    if(active_tab_flag==1){
      if(money-one_upgrade_effectiveness_price>=0){button1Enable(one_upgrade_effectiveness);}
      else{button1Disable(one_upgrade_effectiveness);}

      if(money-one_upgrade_supply_limit_price>=0){button1Enable(one_upgrade_supply_limit);}
      else{button1Disable(one_upgrade_supply_limit);}

      if(money-one_upgrade_generation_price>=0){button1Enable(one_upgrade_generation);}
      else{button1Disable(one_upgrade_generation);}
    }

    if(active_tab_flag==2){
      if(money-two_upgrade_effectiveness_price>=0){button1Enable(two_upgrade_effectiveness);}
      else{button1Disable(two_upgrade_effectiveness);}

      if(money-two_upgrade_supply_limit_price>=0){button1Enable(two_upgrade_supply_limit);}
      else{button1Disable(two_upgrade_supply_limit);}

      if(money-two_upgrade_generation_price>=0){button1Enable(two_upgrade_generation);}
      else{button1Disable(two_upgrade_generation);}
    }

    if(active_tab_flag==3){
      if(money-three_upgrade_effectiveness_price>=0){button1Enable(three_upgrade_effectiveness);}
      else{button1Disable(three_upgrade_effectiveness);}

      if(money-three_upgrade_supply_limit_price>=0){button1Enable(three_upgrade_supply_limit);}
      else{button1Disable(three_upgrade_supply_limit);}

      if(money-three_upgrade_generation_price>=0){button1Enable(three_upgrade_generation);}
      else{button1Disable(three_upgrade_generation);}
    }

    if(active_tab_flag==4){
      if(money-four_upgrade_effectiveness_price>=0){button1Enable(four_upgrade_effectiveness);}
      else{button1Disable(four_upgrade_effectiveness);}

      if(money-four_upgrade_supply_limit_price>=0){button1Enable(four_upgrade_supply_limit);}
      else{button1Disable(four_upgrade_supply_limit);}

      if(money-four_upgrade_generation_price>=0){button1Enable(four_upgrade_generation);}
      else{button1Disable(four_upgrade_generation);}
    }

    if(battery_state==0){
      if(money-battery_unlock_upgrade_price>=0){button1Enable(battery_unlock_upgrade);}
      else{button1Disable(battery_unlock_upgrade);}
    }

    if(money-money_limit_upgrade_price>=0){button1Enable(money_limit_upgrade);}
    else{button1Disable(money_limit_upgrade);}

    researchState();

  }

  function factoryState(){

    if(magnetron_state>0){

      if(charge-magnetron_multiplier_upgrade_price>=0){button1Enable(magnetron_multiplier_upgrade);}
      else{button1Disable(magnetron_multiplier_upgrade);}

      if(charge-magnetron_duration_upgrade_price>=0){button1Enable(magnetron_duration_upgrade);}
      else{button1Disable(magnetron_duration_upgrade);}

    }else{
      if(charge-magnetron_unlock_upgrade_price>=0){button1Enable(magnetron_unlock_upgrade);}
      else{button1Disable(magnetron_unlock_upgrade);}
    }

    if(foundry_state==1){

      if(charge-foundry_components_cycle_upgrade_price>=0){button1Enable(foundry_components_cycle_upgrade);}
      else{button1Disable(foundry_components_cycle_upgrade);}

    }else{
      if(charge-foundry_unlock_upgrade_price>=0){button1Enable(foundry_unlock_upgrade);}
      else{button1Disable(foundry_unlock_upgrade);}
    }

    if(shuttlebay_state==1){

      if(foundry_components-build_shuttle_upgrade_price>=0){button1Enable(build_shuttle_upgrade);}
      else{button1Disable(build_shuttle_upgrade);}

      if(foundry_components-shuttle_capacity_upgrade_price>=0){button1Enable(shuttle_capacity_upgrade);}
      else{button1Disable(shuttle_capacity_upgrade);}

      if(repair_shuttle_flag==1 && foundry_components-repair_shuttle_upgrade_price>=0){button1Enable(repair_shuttle_upgrade);}
      else{button1Disable(repair_shuttle_upgrade);}

    }else{
      if(foundry_components-shuttlebay_unlock_upgrade_price>=0){button1Enable(shuttlebay_unlock_upgrade);}
      else{button1Disable(shuttlebay_unlock_upgrade);}
    }

    if(mc_state==1){

      if(shuttlesCheck()>0){button7Enable(mission_debris_launch);}
      else{button7Disable(mission_debris_launch);}

      if(shuttlesCheck()>0){button7Enable(mission_station_launch);}
      else{button7Disable(mission_station_launch);}

      if(shuttlesCheck()>0){button7Enable(mission_telescope_launch);}
      else{button7Disable(mission_telescope_launch);}

      if(foundry_components-mission_station_upgrade_price>=0){button1Enable(mission_station_upgrade);}
      else{button1Disable(mission_station_upgrade);}

      if(foundry_components-mission_telescope_upgrade_price>=0){button1Enable(mission_telescope_upgrade);}
      else{button1Disable(mission_telescope_upgrade);}

    }else{
      if(shuttlesCheck()>0){button1Enable(mc_unlock_upgrade);}
      else{button1Disable(mc_unlock_upgrade);}
    }

    if(station_state==1){

      //

    }else{
      if(mission_station_launch_flag==2 && mission_debris_amount<1000000000){button1Enable(station_unlock_upgrade);}
      else{button1Disable(station_unlock_upgrade);}
    }

    if(telescope_state==1){

      if(foundry_components-telescope_resolution_upgrade_price>=0){button1Enable(telescope_resolution_upgrade);}
      else{button1Disable(telescope_resolution_upgrade);}

    }else{
      if(mission_telescope_launch_flag==2 && mission_debris_amount<1000000000){button1Enable(telescope_unlock_upgrade);}
      else{button1Disable(telescope_unlock_upgrade);}
    }

    if(charge-charge_limit_upgrade_price>=0){button1Enable(charge_limit_upgrade);}
    else{button1Disable(charge_limit_upgrade);}

    if(battery_charge_percentage_limit<100 && charge-charge_throughput_upgrade_price>=0){button1Enable(charge_throughput_upgrade);}
    else{button1Disable(charge_throughput_upgrade);}

  }

  function prestigeState(){

    var ac_owned=antimatter_cubes-antimatter_cubes_spent;//getting the available cubes
    ac_owned_label.text("["+numT(ac_owned)+"]");

    //all available cubes
    ac_all_label.text("+"+numT(antimatter_cubes)+"%");

    //academy
    if(ac_owned-warp_rank1_upgrade_price>=0){button2Enable(warp_rank1_upgrade);}
    else{button2Disable(warp_rank1_upgrade);}
    if(ac_owned-warp_rank2_upgrade_price>=0){button2Enable(warp_rank2_upgrade);}
    else{button2Disable(warp_rank2_upgrade);}
    if(ac_owned-warp_rank3_upgrade_price>=0){button2Enable(warp_rank3_upgrade);}
    else{button2Disable(warp_rank3_upgrade);}
    if(ac_owned-warp_rank4_upgrade_price>=0){button2Enable(warp_rank4_upgrade);}
    else{button2Disable(warp_rank4_upgrade);}

    //engineering
    if(ac_owned-warp_amplifier_upgrade_price>=0){button2Enable(warp_amplifier_upgrade);}
    else{button2Disable(warp_amplifier_upgrade);}

    if(ac_owned-warp_maintenance_upgrade_price>=0){button2Enable(warp_maintenance_upgrade);}
    else{button2Disable(warp_maintenance_upgrade);}

    if(ac_owned-warp_magnetron_multiplier_upgrade_price>=0){button2Enable(warp_magnetron_multiplier_upgrade);}
    else{button2Disable(warp_magnetron_multiplier_upgrade);}
    if(ac_owned-warp_magnetron_duration_upgrade_price>=0){button2Enable(warp_magnetron_duration_upgrade);}
    else{button2Disable(warp_magnetron_duration_upgrade);}
    if(ac_owned-warp_magnetron_alerting_upgrade_price>=0){button2Enable(warp_magnetron_alerting_upgrade);}
    else{button2Disable(warp_magnetron_alerting_upgrade);}

    //status
    if(ac_owned-warp_wallpaper_upgrade_price>=0){button2Enable(warp_wallpaper_upgrade);}
    else{button2Disable(warp_wallpaper_upgrade);}
    if(ac_owned-warp_magicnumber_upgrade_price>=0){button2Enable(warp_magicnumber_upgrade);}
    else{button2Disable(warp_magicnumber_upgrade);}

    //marking as sold
    if(warp_amplifier_upgrade_flag>0){warp_amplifier_upgrade.text("Sold");button2Disable(warp_amplifier_upgrade);}

    if(actions_limit<=100){button2Disable(warp_maintenance_upgrade);}//protecting the player from purchasing the upgrade by mistake

    if(warp_max_magnetron_duration==120){warp_magnetron_duration_upgrade.text("Sold");button2Disable(warp_magnetron_duration_upgrade);}
    if(warp_max_magnetron_multiplier==20){warp_magnetron_multiplier_upgrade.text("Sold");button2Disable(warp_magnetron_multiplier_upgrade);}
    if(warp_magnetron_alerting==1){warp_magnetron_alerting_upgrade.text("Sold");button2Disable(warp_magnetron_alerting_upgrade);}

    if(engden_state==1){warp_rank1_upgrade.text("Sold");button2Disable(warp_rank1_upgrade);}
    if(lscanner_state==1){warp_rank2_upgrade.text("Sold");button2Disable(warp_rank2_upgrade);}

    if(warp_magicnumber_upgrade_flag==1){warp_magicnumber_upgrade.text("Sold");button2Disable(warp_magicnumber_upgrade);}

  }
  function prestigeInit(){

    //setting up prices

    //academy
    warp_rank1_upgrade_price=Math.pow(10,2);warp_rank1_upgrade.text("▣" + numT(warp_rank1_upgrade_price));
    warp_rank2_upgrade_price=Math.pow(10,8);warp_rank2_upgrade.text("▣" + numT(warp_rank2_upgrade_price));
    warp_rank3_upgrade_price=Math.pow(10,12);warp_rank3_upgrade.text("▣" + numT(warp_rank3_upgrade_price));
    warp_rank4_upgrade_price=Math.pow(10,16);warp_rank4_upgrade.text("▣" + numT(warp_rank4_upgrade_price));

    //engineering
    warp_amplifier_upgrade_price=Math.pow(10,0);warp_amplifier_upgrade.text("▣" + numT(warp_amplifier_upgrade_price));

    warp_maintenance_upgrade.text("▣" + numT(warp_maintenance_upgrade_price));

    warp_magnetron_duration_upgrade_price=Math.pow(10,6);warp_magnetron_duration_upgrade.text("▣" + numT(warp_magnetron_duration_upgrade_price));
    warp_magnetron_multiplier_upgrade_price=Math.pow(10,6);warp_magnetron_multiplier_upgrade.text("▣" + numT(warp_magnetron_multiplier_upgrade_price));
    warp_magnetron_alerting_upgrade_price=Math.pow(10,7);warp_magnetron_alerting_upgrade.text("▣" + numT(warp_magnetron_alerting_upgrade_price));

    //status
    warp_wallpaper_upgrade_price=Math.pow(10,2);warp_wallpaper_upgrade.text("▣" + numT(warp_wallpaper_upgrade_price));
    warp_magicnumber_upgrade_price=Math.pow(10,3);warp_magicnumber_upgrade.text("▣" + numT(warp_magicnumber_upgrade_price));

    prestigeState();

  }

  function magnetronRequest(){

    if(Math.floor((Math.random() * magnetron_probability_max) + 1)==25){

      magnetron_state=2;//set magnetron state to armed

      magnetron_buttonEnable();

      if(warp_magnetron_alerting==1){
        PlayAudio(6);
      }

    }

  }
  function couplingsWear(){

    if(Math.floor( ( Math.random() * ( auxiliary_probability_max + animal5_auxiliary_probability_modifier ) ) + 1)==5){

      var avalue;

      if(Math.floor((Math.random() * 2) + 1)==1){
        avalue=parseInt(auxiliary_lever1.val())-1;
        if(avalue<-50){avalue=-50;}
        auxiliary_lever1.val(avalue);
        auxiliary_effectiveness1=5-Math.abs( Math.floor(avalue/10) );
      }else{
        avalue=parseInt(auxiliary_lever2.val())+1;
        if(avalue>50){avalue=50;}
        auxiliary_lever2.val(avalue);
        auxiliary_effectiveness2=5-Math.abs( Math.ceil(auxiliary_lever2.val()/10) );
      }

      auxiliary_effectiveness=1+(auxiliary_effectiveness1+auxiliary_effectiveness2)*0.01;
      auxiliary_effectiveness_label.text("[+"+(auxiliary_effectiveness1+auxiliary_effectiveness2)+"%]");

    }

  }

  //machines init functions
  function batteryInit(){

    battery_state=1;//battery is unlocked

    //function contains what is required to initialize the unit
    charge_limit=50;charge_limit_label.text("["+numT(charge_limit)+"]");
    charge_limit_upgrade_price=10;charge_limit_upgrade.text("⑂" + numT(charge_limit_upgrade_price));
    charge_throughput_upgrade_price=Math.pow(10,6);charge_throughput_upgrade.text("⑂" + numT(charge_throughput_upgrade_price));
    charge=0;progress_battery();//so that when the battery is activated, there is a sign on its progress bar

      //animal multipler
      if((animal7_battery_charge_multiplier-1)>0){animal7_battery_charge_multiplier_label.text('x'+(Math.floor((animal7_battery_charge_multiplier-1)*100))+'%');}else{animal7_battery_charge_multiplier_label.text('');}

    battery_charge_percentage_limit=1;
    battery_charge_percentage=1;battery_charge_percentage_label.text(battery_charge_percentage+"%");//we start with %1, so that new players are not confused and the machine start to work immediately (although it's still possible that they would need to generate more to see the effect)
    charge_throughput_label.text("["+battery_charge_percentage_limit+"%]");

    //because we probably won't be able to afford it when the battery just activates
    factoryState();

    battery_lock_block.hide();
    battery_block.show();

    magnetron_unlock_upgrade_price=Math.pow(10,9);magnetron_unlock_upgrade.text("⑂" + numT(magnetron_unlock_upgrade_price));
    button1Disable(magnetron_unlock_upgrade);
    magnetron_lock_block.show();
  }
  function magnetronInit(){

    magnetron_state=1;//magnetron is unlocked

    //function contains what is required to initialize the unit
    device_magnetron_multiplier=2;magnetron_multiplier_label.text("[x"+device_magnetron_multiplier+"]");magnetron_button.text("x"+(device_magnetron_multiplier+animal3_magnetron_multiplier));
    magnetron_multiplier_upgrade_price=Math.pow(10,10);magnetron_multiplier_upgrade.text("⑂" + numT(magnetron_multiplier_upgrade_price));
      //animal multipler
      if(animal3_magnetron_multiplier>0){animal3_magnetron_multiplier_label.text('+'+animal3_magnetron_multiplier);}
      else{animal3_magnetron_multiplier_label.text('');}

    magnetron_duration=30;magnetron_duration_label.text("["+magnetron_duration+" sec]");
    magnetron_duration_upgrade_price=Math.pow(10,9);magnetron_duration_upgrade.text("⑂" + numT(magnetron_duration_upgrade_price));
      //animal multipler
      if(animal2_magnetron_duration>0){animal2_magnetron_duration_label.text('+'+animal2_magnetron_duration);}
      else{animal2_magnetron_duration_label.text('');}

    magnetron_probability_max=2000;

    magnetron_buttonDisable();
    magnetron_duration_upgrade.show();
    magnetron_multiplier_upgrade.show();

    magnetron_lock_block.hide();
    magnetron_block.show();

    foundry_unlock_upgrade_price=Math.pow(10,17);foundry_unlock_upgrade.text("⑂" + numT(foundry_unlock_upgrade_price));
    button1Disable(foundry_unlock_upgrade);
    foundry_lock_block.show();
  }
  function foundryInit(){

    foundry_state=1;//foundry is unlocked

    foundry_heating_stage=0;
    foundry_components_multiplier=1;foundry_components_multiplier_label.text("["+Math.floor(foundry_components_multiplier)+"]");
    foundry_production_flag=0;//when initialized, the foundry is in non-production mode and requires heating up first
    foundry_components=0;

    fccu_stage=0;
    fccu_level=1;

    progress3(fccu_stage,pb_components_multiplier,pb_components_multiplier_indicator,"+1");

    //function contains what is required to initialize the unit
    foundry_components_cycle_upgrade_price=Math.pow(10,20);foundry_components_cycle_upgrade.text("⑂" + numT(foundry_components_cycle_upgrade_price));
    foundry_components_label.text("⯎" + numT(foundry_components));

    //animal multipler
    if((animal6_components_multiplier-1)>0){animal6_components_multiplier_label.text('x'+(Math.floor((animal6_components_multiplier-1)*100))+'%');}else{animal6_components_multiplier_label.text('');}

    foundry_temperature=0;furnace_screen.text(foundry_temperature+" °C");
    if(battery_charge_percentage>=10){
      furnace_screen.removeClass('furnace_screen_dim').addClass('furnace_screen_lit');
    }else{furnace_screen.removeClass('furnace_screen_lit').addClass('furnace_screen_dim');}
    foundry_lock_block.hide();
    foundry_block.show();

    shuttlebay_unlock_upgrade_price=Math.pow(10,6);shuttlebay_unlock_upgrade.text("⯎" + numT(shuttlebay_unlock_upgrade_price));
    button1Disable(shuttlebay_unlock_upgrade);
    shuttlebay_lock_block.show();
  }
  function shuttlebayInit(){

    shuttlebay_state=1;//shuttlebay is unlocked

    shuttle_fleet={//re-initializing with proper shuttle names
      name:['Ganges','Yangtzee Kiang','Mekong','Yukon','Rio Grande'],
      availability:['0','0','0','0','0'],
    };
    drawShuttles();
    build_shuttle_row.show();

    build_shuttle_upgrade_price=Math.pow(10,6);build_shuttle_upgrade.text( "⯎" +  numT(build_shuttle_upgrade_price) );
    shuttle_capacity_upgrade_price=Math.pow(10,9);shuttle_capacity_upgrade.text( "⯎" +  numT(shuttle_capacity_upgrade_price) );
    repair_shuttle_upgrade_price=Math.pow(10,9);repair_shuttle_upgrade.text( "⯎" +  numT(repair_shuttle_upgrade_price) );

    shuttle_capacity=100;shuttle_capacity_upgrade_label.text("["+shuttle_capacity+"]");

    bsu_stage=0;//build shuttle stage (for pb)
    rsu_stage=0;

    progress3(bsu_stage,pb_build_shuttle,pb_build_shuttle_indicator,'');
    progress3(rsu_stage,pb_repair_shuttle,pb_repair_shuttle_indicator);

    shuttlebay_lock_block.hide();
    shuttlebay_block.show();

    mc_unlock_upgrade.html('<img src="img/shuttle.png" width="20">');
    button1Disable(mc_unlock_upgrade);
    mc_lock_block.show();
  }
  function mcInit(){

    mc_state=1;

    mission_debris_amount=1257861241;
    mission_debris_launch.show();
    mission_debris_upgrade_label.text("Debris detected: " + mission_debris_amount);
    greenToRed(mission_debris_upgrade_label);

    mission_station_status=0;
    mission_station_launch.show();
    mission_station_upgrade_label.text("Deployment status: " + mission_station_status + '%');
    greenToRed(mission_station_upgrade_label);

    mission_station_upgrade_price=Math.pow(10,3);mission_station_upgrade.text( "⯎" +  numT(mission_station_upgrade_price) );

    mission_telescope_status=0;
    mission_telescope_launch.show();
    mission_telescope_upgrade_label.text("Deployment status: " + mission_telescope_status + '%');
    greenToRed(mission_telescope_upgrade_label);

    mission_telescope_upgrade_price=Math.pow(10,9);mission_telescope_upgrade.text( "⯎" +  numT(mission_telescope_upgrade_price) );

    //resetting debris mission details
    mission_debris_launch_flag=0;//mission not launched yet
    mission_debris_block_progress.hide();
    mission_debris_shuttle_name.text('');
    mission_debris_stage=0;
    progress3(0,pb_mission_debris,pb_mission_debris_indicator,'');

    //resetting station mission details
    mission_station_launch_flag=0;//mission not launched yet
    mission_station_block_progress.hide();
    mission_station_shuttle_name.text('');
    mission_station_stage=0;
    progress3(0,pb_mission_station,pb_mission_station_indicator,'');

    //resetting telescope mission details
    mission_telescope_launch_flag=0;//mission not launched yet
    mission_telescope_block_progress.hide();
    mission_telescope_shuttle_name.text('');
    mission_telescope_stage=0;
    progress3(0,pb_mission_telescope,pb_mission_telescope_indicator,'');

    mc_lock_block.hide();
    mc_block.show();

    station_unlock_upgrade.html('0%');
    telescope_unlock_upgrade.html('0%');
    button1Disable(station_unlock_upgrade);
    station_lock_block.show();
    telescope_lock_block.show();
  }
  function stationInit(){
    station_state=1;

    chief=1;//this makes the player chief engineer
    rank_label.text("[Chief Engineer]");

    station_lock_block.hide();
    station_block.show();

  }
  function telescopeInit(){

    telescope_state=1;

    telescope_seconds_amount=0;
    telescope_stars_amount_limit=Math.pow(10,12);//1T

    telescope_stars_amount=0;telescope_stars_amount_label.text('['+numT(telescope_stars_amount)+'/1000000000000]');
    telescope_galaxies_amount=0;telescope_galaxies_amount_label.text('['+numT(telescope_galaxies_amount)+']');
    telescope_resolution=100;telescope_resolution_label.text('[1-'+telescope_resolution+']');

    telescope_resolution_upgrade_price=Math.pow(10,27);telescope_resolution_upgrade.text( "⯎" +  numT(telescope_resolution_upgrade_price) );



    telescope_lock_block.hide();
    telescope_block.show();

  }

  //shuttles
  function drawShuttles(){//displaying shuttles at shuttleport

    shuttleport.text('');//emptying the div

    for (let i = 0; i < 5; i++) {
      if(shuttle_fleet['availability'][i]==1){
        shuttleport.append('<img src="img/shuttle.png" width="30">\n');
      }else{
        shuttleport.append('<img src="img/shuttle.png" width="30" style="visibility:hidden">\n');
      }
    }

  }
  function shuttlesBuiltCheck(){//how many shuttles have been built

    var count=0;

    for (let i = 0; i < 5; i++) {

      if(shuttle_fleet['availability'][i]>0){
        count++;
      }

    }

    return count;

  }
  function shuttlesCheck(){//how many shuttles are actually available

    var count=0;

    for (let i = 0; i < 5; i++) {

      if(shuttle_fleet['availability'][i]==1){
        count++;
      }

    }

    return count;

  }
  function takeShuttle(mission_code){//take available shuttle

    for (let i = 0; i < 5; i++) {

      //take the first available shuttle
      if(shuttle_fleet['availability'][i]==1){
        shuttle_fleet['availability'][i]=mission_code;
        drawShuttles();//refresh shuttleport
        return;
      }

    }
  }
  function returnShuttle(mission_code){//return shuttle from mission

    for (let i = 0; i < 5; i++) {

      //take the first available shuttle
      if(shuttle_fleet['availability'][i]==mission_code){
        shuttle_fleet['availability'][i]=1;
        drawShuttles();//refresh shuttleport
      }

    }
  }
  function obtainShuttleName(mission_code){
    return shuttle_fleet['name'][ shuttle_fleet['availability'].indexOf(mission_code) ];
  }

  function missionDebris(){

    mission_debris_stage+=25;

    if(mission_debris_stage==100){

      //PlayAudio(8);

      mission_debris_stage=0;
      mission_debris_amount-=shuttle_capacity;

      if(mission_debris_amount<=0){
        mission_debris_amount=0;
        mission_debris_block_progress.hide();
        mission_debris_upgrade_label.text("Mission complete");
                returnShuttle(101);
        mission_debris_launch_flag=2;//mission complete (this is used as a flag for moneyCalc() )

      }else{
        mission_debris_upgrade_label.text("Debris detected: " + mission_debris_amount);
      }

    }

    progress3(mission_debris_stage,pb_mission_debris,pb_mission_debris_indicator,'');

  }

  //research lab
  function buildResearchList(){//this displays the list

    bonusbox.html('&nbsp;');

    for (let i = 0; i < 8; i++) {

      let color_class;
      let description;
      let type=researchList.type[i];

        if(type==1){//power increase
          color_class="blue";
          description='+'+researchList.effect[i]+'% Power';
        }
        if(type==2){//supply increase
          color_class="green";
          description='x'+researchList.effect[i]+' Supply';
        }
        if(type==3){//Lifeform
          color_class="red";
          description='Lifeform';
        }

      $( "#bonusboxblock_"+(i+1) ).html('<b><span class="'+color_class+'">⌬'+numT(researchList.price[i])+'</span></b><br><br>');
      $( "#bonusboxblock_"+(i+1) ).append('<span class="silver">'+description+'</span>');

    }

  }
  function researchRequest(){//this generates a new item

    var type;
    var effect;
    var price;
    var research_probability;

    //handling probabilities of different item types

    if(lscanner_state==1 && recency<1){research_probability=0.6;}
    else{research_probability=0.75;}

    if(Math.random()<research_probability){//most are power increases
      researchList.type[7]=1;
    }else{//the rest divided between supply increases and lifeforms
      if(lscanner_state==1 && recency<1){//higher chance of encountering a lifeform when you unlock lscanner, unless recency>0
        researchList.type[7]=getRandomInt(2,4);
        if(researchList.type[7]==4){researchList.type[7]=3;}//if we get a 4, this means a lifeform, so we set it to 3, so that later that value could be used to identify a lifeform
      }else if(lscanner_state==1 && recency>1){//if trying to reboot again, lifeforms are gone until properly rebooted
        researchList.type[7]=2;
      }else{researchList.type[7]=getRandomInt(2,3);}//this happens when lscanner_state==0 and also when lscanner_state==1 && recency==1

    }

    //settng up item types and their prices

    if(researchList.type[7]==1){

      researchList.effect[7]=getRandomInt(1,3);//1-3% of power increase

      //price depends on both the strength of the effect and the price of the last item
      researchList.price[7]=researchList.price[6]*researchList.effect[7]*2;

    }else if(researchList.type[7]==2){
      researchList.effect[7]=2;//doubling of the smallest supply
      researchList.price[7]=researchList.price[6]*2;
    }else{
      researchList.effect[7]=getRandomInt(0,7);//type of lifeform
      researchList.price[7]=researchList.price[6]*2;
    }


    buildResearchList();

  }
  function researchState(){//this checks if we have enough funds to buy

    //I wanted to optimize here by identifying the first item that the player cannot afford and then disabling everything else after it, since the price can either be the same or grow. However, the problem is that I can't use cached selectors then and can only construct them using explicit calls $("#bonusbox_block"+i). Or I can use eval() to construct variables from strings. I think that both options might be slower than simply checking money against all prices one by one, as there are only 8 of them

    if(money-researchList.price[0]>=0){bonusEnable(bonusboxblock_1);}
    else{bonusDisable(bonusboxblock_1);}

    if(money-researchList.price[1]>=0){bonusEnable(bonusboxblock_2);}
    else{bonusDisable(bonusboxblock_2);}

    if(money-researchList.price[2]>=0){bonusEnable(bonusboxblock_3);}
    else{bonusDisable(bonusboxblock_3);}

    if(money-researchList.price[3]>=0){bonusEnable(bonusboxblock_4);}
    else{bonusDisable(bonusboxblock_4);}

    if(money-researchList.price[4]>=0){bonusEnable(bonusboxblock_5);}
    else{bonusDisable(bonusboxblock_5);}

    if(money-researchList.price[5]>=0){bonusEnable(bonusboxblock_6);}
    else{bonusDisable(bonusboxblock_6);}

    if(money-researchList.price[6]>=0){bonusEnable(bonusboxblock_7);}
    else{bonusDisable(bonusboxblock_7);}

    if(money-researchList.price[7]>=0){bonusEnable(bonusboxblock_8);}
    else{bonusDisable(bonusboxblock_8);}

  }

  //lifeforms scanner
  function buildLifeformsCollection(){

    //this is built so that all the variables (except for animal8_magicnumber_flag) do not need to be saved, and depend entirely on the amount of lifeforms you have collected. And each time you collect a new one, this function not only redraws the Lifeforms Scanner, but also recalculates all the animal multipliers

    for (let i = 0; i < 8; i++) {

      if(lifeforms_collection[i]>0){
        $("#animal"+(i+1)).css("visibility", "visible");

        //this is a bit messy, since the downside of rebuilding everything from scratch is that you can't easily access the latest added object. So, I am using a couple of global variables to be used in an anonymous setTimeout function that will briefly flash the number on the lifeform card that was added; also hoping that invoking an anonymous setTimeout function many times won't create problems, but from what I've read there is no need to do any cleanup after using setTimeout
        //Worst case scenario, I was thinking of adding a log that tells you what was added, but tbh in many cases you shouldn't really care which lifeform was added exactly. And if you are focused on something in particular, you'll know
        if(i==last_animal){
          last_animal=999;
          last_animal_id="#animal_quantity_"+(i+1);
          silverToRedBold($("#animal_quantity_"+(i+1)));
          $("#animal_quantity_"+(i+1)).text("Quantity: " + lifeforms_collection[i]);
          setTimeout(() => {
            redBoldToSilver($(last_animal_id));
          },350);
        }else{
          redBoldToSilver($("#animal_quantity_"+(i+1)));
          $("#animal_quantity_"+(i+1)).text("Quantity: " + lifeforms_collection[i]);
        }

      }else{
        $("#animal"+(i+1)).css("visibility", "hidden");
      }

      switch(i){
        case 0:
          //the bonus is directly correlated with the amount of lifeforms collected and is added to the bonus_multiplier in moneyCalc(), so we multiply it by 0.01, so that it becomes a percentage
          animal1_bonus_multiplier=lifeforms_collection[i]*0.01;
        break;

        case 1:
          //every 5 of this lifeform increases magnetron duration. It is then being added to normal magnetron_duration
          animal2_magnetron_duration=parseInt(lifeforms_collection[i]/5);
            //display
            if(animal2_magnetron_duration>0){animal2_magnetron_duration_label.text('+'+animal2_magnetron_duration);}
            else{animal2_magnetron_duration_label.text('');}
        break;

        case 2:
          //same for this one
          animal3_magnetron_multiplier=parseInt(lifeforms_collection[i]/5);
            //display
            if(animal3_magnetron_multiplier>0){animal3_magnetron_multiplier_label.text('+'+animal3_magnetron_multiplier);}
            else{animal3_magnetron_multiplier_label.text('');}
        break;

        case 3:
          //supply prices grow by 25%. Therefore, this upgrade is capped at 19%, meaning that the best the player can do is reduce supply price growth to 1%. And also, it's again every 5 lifeforms
          animal4_supply_price_reduction=(parseInt(lifeforms_collection[i]/5))*0.01;
          if(animal4_supply_price_reduction>0.19){animal4_supply_price_reduction=0.19;}
        break;

        case 4:
          //directly correlated with the number of lifeforms collected, is added to auxiliary_probability_max
          animal5_auxiliary_probability_modifier=lifeforms_collection[i];
        break;

        case 5:
          //directly correlated, multiplied by 0.01 to turn into percents
          animal6_components_multiplier= 1 + (lifeforms_collection[i]*0.01);
            //display
            if((animal6_components_multiplier-1)>0){animal6_components_multiplier_label.text('x'+(Math.round((animal6_components_multiplier-1)*100))+'%');}else{animal6_components_multiplier_label.text('');}
        break;

        case 6:
          //every 5 lifeforms, normalized for percentage
          animal7_battery_charge_multiplier= 1 + (parseInt(lifeforms_collection[i]/5))*0.01;
            //display
            if((animal7_battery_charge_multiplier-1)>0){animal7_battery_charge_multiplier_label.text('x'+(Math.round((animal7_battery_charge_multiplier-1)*100))+'%');}else{animal7_battery_charge_multiplier_label.text('');}
        break;

        case 7:
          if(lifeforms_collection[i]>100 && animal8_magicnumber_flag==0){
            animal8_magicnumber_flag=1;
            magicnumber++;
            magicnumber_label.text("["+magicnumber+"]");
          }
        break;

      }

    }//loop

  }

  function autoPowerLimit(){//not used
    PlayAudio(2);

    money-=money_limit_upgrade_price;
    money_limit=Math.floor(money_limit*1.5);

    money_limit_upgrade_price= Math.floor(money_limit_upgrade_price + money_limit_upgrade_price*0.5);

    money_limit_upgrade.text("⌬" + numT(money_limit_upgrade_price));

    money_limit_label.text("["+numT(money_limit)+"]");

    //actions++;ActionsUpdate();
    InventoryUpdate();
  }

  //telescope news functions
  function Telescope(){

    telescope_list=[];

      //NEWS items
      telescope_list.push(choose([

        '<b>News:</b> '+choose(['Non-organic isopods','Plasma leaks','Poorly written romance novels','Strange noises from the Plasma generator','Low-frequency noises from below the Plasma generator','Suspicious odors from one of the containers of the Plasma generator','Occasional leaks from the Plasma generator','Plasmic frogs','Unseen spiders'])+' were shown to be a direct consequence of '+choose(['irresponsible engineering experiments','random neutrino collisions','quantum mechanics as we understand it','the second law of thermodynamics','media coverage of the issue']),

        '<b>News:</b> EU Parliament has just announced that engineers are going to be honored every Wednesday',

        '<b>News:</b> EU Parliament began '+choose(['a session on','working on'])+' replacing some of the outdated regulation regarding the rights of non-organics',

        '<b>News:</b> EU Parliament considers setting up '+choose(['a workgroup','an institute','a committee','a research laboratory'])+' dedicated to studying non-organic isopods as a potential food source',

        '<b>News:</b> EU Parliament was grilled by the press regarding '+choose(['the rights of non-organics','the rights of non-organics to public charging stations','the invasion of relatively large worms','non-organic isopods as a potential food source for pets']),

        '<b>News:</b> A national seismological survey reveals that some seismologists have registered low-frequency vibrations coming from the Plasma Generator',

        '<b>News:</b> A study finds no health risks of frequent warping',

        '<b>News:</b> A study reveals that frequent warping is good for your health',

        '<b>News:</b> A study reveals that frequent warping is beneficial to one\'s sex life',

        '<b>News:</b> A study reveals that non-organic organisms have been spotted in major cities across the world',

        '<b>Local News:</b> A referendum voices support for more research into '+choose(['large worms','duotronic butterflies','non-organic isopods','unkempt engineers'])+' that have been spotted throughout the city'

      ])
    );

      //Internal announcements
      telescope_list.push(choose([

        '<b>Announcement:</b> section '+getRandomInt(2,13)+' is closed for maintenance',

        '<b>Announcement:</b> section '+getRandomInt(2,13)+' has been reopened after maintenance',

        '<b>Announcement:</b> a pipe burst in section '+getRandomInt(2,13)+', please put on your radiation shielding suit when passing through. Thank you',

        '<b>Announcement:</b> an unclear event occured in section '+getRandomInt(2,13)+', please keep out until the investigation is concluded. Thank you',

        '<b>Announcement:</b> a wild engineer was sighted in section '+getRandomInt(2,13)+'. Please don\'t leave food lying around. Thank you',

        '<b>Announcement:</b> a crowding of cable lizards has created significant cable clutter in the Eingineering Den. Please clear it out. Thank you.',

        '<b>Announcement:</b> a can of worms was left open near the Nuclear generator. Keep in mind that some of the worms have grown since then. Considerably',

        '<b>Announcement:</b> a floor administrator witnessed' + choose(['the mating','skin shedding','the mating ritual','']) + ' of '+choose(['unseen spiders','mutated worms','cable lizards','non-organic isopods'])+'. Counseling sessions have been set up',

        '<b>Announcement:</b> a floor administrator is '+choose(['allegedely swallowed and then spit out by the Pek Monster','temporarily kidnapped by an organized group of nanobots','attacked by a couple of plasmic frogs','infused with non-organic DNA and grows a metal arm','seen hunting down a duplicitous cable lizard']),

        '<b>Announcement:</b> floor administrators have set up guard posts ' + choose(['to catch UFOs that hover over generators','to ward off '+choose(['cable lizards','nut beetles','non-organic isopods','plastic flies','plasmic frogs','mutated worms']),'to protect '+ choose(['themselves','the Engineering Den','the Foundry','the canteen','the Battery','the Magnetron','the Shuttlebay','Mission Control']) + ' from ' + choose(['nut beetle hoards','mutated warms invasions','cable lizard packs','the Pek Monster','plastic fly clouds','non-organic isopod gatherings']) ]),

        '<b>Announcement:</b> to offset working conditions, some floor administrators have been offered additional ' + choose(['benefits','leave','pay','food','beer','coffee','coffee and marshmellows','counseling sessions']),

        '<b>Announcement:</b> '+choose(['breakfast','lunch','tea','happy hour'])+' is happening',

        '<b>Announcement:</b> tracks of '+choose(['unseen spiders','mutated worms','cable lizards'])+' were spotted on the wall of '+choose(['the Electric generator','the Plasma generator','the Nuclear generator','the Gravity generator']),

        choose(['A bunch of','A gathering of','A group of'])+' '+choose(['isopods','unidentified organisms','civilians','visitors','workers from the last shift','lawyers','unkempt engineers with empty coffee mugs'])+' '+choose(['was spotted','was reported','was seen','was sighted'])+' hiding under '+choose(['the Electric generator','the Plasma generator','the Nuclear generator','the Gravity generator'])+'. Security has been informed about the incident.',

        choose(['Traces of non-organic isopods','A severed leg of a non-organic organism','Non-organic eggs of unknown insect species'])+'  were discovered on one of the pipes of '+choose(['the Electric generator','the Plasma generator','the Nuclear generator','the Gravity generator'])+'. Scientists '+choose(['are preparing to publish a paper on the subject','are recommending a non-organic insecticide solution','ponder if there is any risk to the engineers in the area']),

        choose(['A bunch of','A gathering of','A group of'])+' '+choose(['isopods','unidentified organisms','civilians','visitors','workers from the last shift','lawyers','unkempt engineers with empty coffee mugs'])+' '+choose(['was spotted','was reported','was seen','was sighted'])+' hiding under '+choose(['the Electric generator','the Plasma generator','the Nuclear generator','the Gravity generator'])+'. No action is required',

        'Several '+choose(['interns','visitors','managers'])+' got lost in the Engineering Den last week',

        'Please report any unidentified persons with unkempt appearances unless you suspect they are engineers'

      ])
    );

      //Internal Bulletin of Random Things
      telescope_list.push(choose([

        '<b>Internal Bulletin:</b> A UFO was spotted hovering over one of the generators. ' + choose(['It was shot down by floor administrators','It was eaten by an unknown organism','It was later identified to be a plastic fly','It was later identified and became IFO','It was promptly snatched by an unidentified organism']),

        '<b>Internal Bulletin:</b> An unidentified crawling object (UCO) was spotted in '+choose(['the Engineering Den','the Foundry','Shuttlebay','Mission Control']),

        '<b>Internal Bulletin:</b> Several items disappeared from the Research Lab. ' +choose(['Interns blame each other','Nut beetles are suspected','The perpetrator is unknown','Security was informed','No donuts were taken','One of them was later found half devoured']),

        '<b>Internal Bulletin:</b> ' + choose(['Screwdriver throwing contest will be held in the Engineering Den at 1800','A non-organic isopod race will be held at the canteen right after lunch','A non-organics flea market will be held Saturday afternoon, as usual. Iridium fleas are still banned.','An unofficial non-organics collectors\' convention is going to be held next month','A debate on the topic "Are plasmic frogs actually an organic lifeform?" has been canceled','A debate on the topic "Are plasmic frogs actually an organic lifeform?" is scheduled for tomorrow']),

        '<b>Internal Bulletin:</b> ' + choose(['a nut beetle','a duotronic butterfly','a flask of mech ciliates','a non-organic isopod']) + ' ' + choose(['infused with gold','painted in rainbow colors','decorated with edible elements','submerged in amber']) + ' was ' + choose(['sold for an undisclosed sum of money','traded for a cup of coffee','sold at a black market','sold for a record sum of money','confiscated by authorities'])

      ])
    );

      //wild rumours and stupidity
      telescope_list.push(choose([

        choose(['A scientist','Someone online','A conspiracy theorist','A person on the Internet','A fellow engineer','Talk show host','An amateur philosopher','A prominent writer','A local comedian']) + ' ' + choose(['claims that','concludes that','maintains that','insists that','believes that','wonders if','suggests that','alleges that']) + ' ' + choose(['non-organic isopods are an evolved lifeform','non-organic isopods are secretly organic','non-organic isopods have evolved from some archaic computer technology','plastic flies cannot be killed with a plastic flyswatter','plastic flies are good for economy','plastic flies can be used for a variety of purposes in the home','nut beetles are programmed to search for a mating bolt','Pek Monster is an amalgamation of all the known non-organic lifeforms','plasmic frogs could be an addition to a healthy post-apocalyptic diet','mutated worms are partially non-organic','non-organic life is more normal than organic becase "they don\'t poop"','the low-frequency hum of the Plasma generator is a conspiracy','the low-frequency hum of the Plasma generator is a sign of emerging intelligence','unseen spiders actually exist','unseen spiders meet the definition of a veridical paradox','unseen spiders is a hoax perpetrated by overworked operators','they have seen an unseen spider','non-organic life should be considered property theft: "They incorporate our stuff into their bodies and then run away"','duotronic butterflies are actually monotronic','cable lizards could be assembled into one really long cable'])

      ])
    );

      //general advice and warnings
      telescope_list.push(choose([

        '<b>Warning:</b> '+choose(['Be mindful','Be careful','Be extra careful','Be especially attentive'])+' when attempting to '+choose(['debug the low-frequency hum of the Plasma generator','catch a non-organic isopod']) + ' so as not to ' + choose(['fall into an open hatch','get stuck','be eaten by an unknown organism','be kidnapped by a nanobot tribe']),

        '<b>Warning:</b> make sure to fully develop your generators before upgrading them to the next generation',

        '<b>Warning:</b> don\'t abuse the overdrive, its maintenance is very expensive',

        '<b>Warning:</b> there\'s no way to "un-upgrade" the supply limit',

        '<b>Hint:</b> click on a button and hold "Enter" to push through multiple upgrades',

        '<b>Hint:</b> solo a generator that you want to track',

        '<b>Hint:</b> allow the clicking of the generators to guide your daily meditation',

        '<b>Hint:</b> consult the manual',

        '<b>Hint:</b> prepare the generators for the night run by developing the power limit and the supply of the most powerful generator',

        '<b>Hint:</b> don\'t rush to upgrade to the next generation if you\'ll have no resources to quickly grow its supply'

        ])
      );

      //did you know that
      telescope_list.push(choose([

        '<b>Did you know that</b> ' + choose(['the Research Lab has been working on a non-organic caterpillar, the first artificial lifeform','all existing non-organic lifeforms might have evolved from existing machinery','Factory kitchen is situated right next to the Nuclear generator and relies on it for heating and power','the Engineering Den is not a single floor: anything below it is known as the "jungle", but is only accessible to Floor Administrators','"foundry" is the only word that contains the letters "f", "o", "u, "n", "d", "r" and "y" in exactly that order']) + '?',

        '<b>Fun fact:</b> ' + choose(['non-organic isopods eat mazut, which is why they have to be kept out of fuel storage compartments','cable lizards are considered to be pests because they live in groups and frequently get entangled, blocking passages in the Engineering Den','duotronic butterflies use tiny magnets to stick to ceilings','plasmic frogs are actually dangerous to humans and can inflict damage by shooting streams of plasma','mutated worms don\'t age and usually die because they become too large','mech ciliates can now be found in every device of both the Power Plant and Factory','plastic flies use pipes and cables to travel between rooms','nut beetles use their appearance to hide between regular nuts, and a number of beetles have actually been incorporated into machinery by mistake','nut beetles that get mistaken for regular nuts are able to unscrew themselves and run away in 30% of cases','duotronic butterflies can change the color of their wings based on their surroundings','researchers are still not sure whether plastic flies require sustenance','plastic flies live 30-50 minutes on average','iridium fleas are illegal to trade and keep as pets','mech ciliates are smaller than antimatter cubes','mech ciliates are capable of feeding on antimatter and a cililate colony could devour an antimatter cube in a matter of hours','there are over 70 registered non-organic lifeforms, but only 12 species have established populations']),

        ])
      );

      //general quotes
      telescope_list.push(choose([

        '"'+choose(['Be the best you can','Never give up','Stand for what\'s right','Eat your soup','Shaving is not a requirement','Don\'t complain','Higher ups don\'t know shit','If you put your mind to it, you can break anything','It\'s all in your head','Focus on the process, bring me results'])+'" - chief engineer',

        '"'+choose(['UFOs? Never seen one','I haven\'t seen anything','I don\'t know what you\'re talking about','I heard nothing','Nothing ever happens during my shift','I just work here','Pek Monster is an urban legend for sure'])+'" - floor administrator',

        '"'+choose(['UFOs? Never seen one','I haven\'t seen anything','I don\'t know what you\'re talking about','I heard nothing','Nothing ever happens during my shift','I just work here','Pek Monster is an urban legend for sure'])+'" - floor administrator',

        '"'+choose(['I know, right?','Do we warp now, man?','Much antimatter?','What does this button do?','Should we flip this switch?','Wow, what do we do now?','Wild, eh?','Lunch?'])+'" - intern',

        ])
      );

      //magnetron
      if(magnetron_state>0) telescope_list.push(choose([

        'Engineer\'s log: ' + choose(['A number of','A group of','A bunch of','A handful of']) +' ' + choose(['mutated worms','non-organic isopods','slightly mutated worms','mutated worms and non-organic isopods']) + ' are ' + choose(['crawling about on the magnetron','spotted under the magnetron','mating on a panel of the magnetron','forming weird shapes on the magnetron','trying to chew on the magnetron','gnawing on the big magnetron button','glowing when near the magnetron','exhibiting strange behavior when near the magnetron']),

        '"'+choose(['Magnetron is your friend','Treat your magnetron well'])+'" - chief engineer',

        '<b>News:</b> Magnetrons have been voted '+ choose(['"tech\'s hope for the future"','"the world\'s coolest devices"','the leading tech that starts with the letter "m", second only to magnets'])

        ])
      );

      //foundry
      if(foundry_state==1) telescope_list.push(choose([

        'Engineer\'s log: ' + choose(['A cloud of','A horde of','A swarm of']) + ' plastic flies ' + choose(['has just flown straight into the furnace','was seen circling the foundry','attempted to invade the foundry','was caught in the foundry','was recycled into components','was just eaten by an unknown organism','was registered by a sentient photosensor as "Plastic Fly Group #' + getRandomInt(100,10000) + '"']),

        '"'+choose(['Keep that furnace burning','The foundry is the heart'])+'" - chief engineer',

        '<b>News:</b> Scientists are '+ choose(['looking into','suggesting','considering']) + ' methods to use foundry furnace to ' + choose(['produce swords for fantasy conventions','provide lighting source for scribes','make Christmas cookies']),

        '<b>News:</b> ' + choose(['"We should introduce the non-organic isopod into the foundry ecosystem"','"Components should be made out of organic matter, like chocolate"','"Unseen spiders are key to misunderstanding the nature of the Universe"']) + ', says researcher',

        '<b>News:</b> "Plastic flies are a solution to ' + choose(['poverty','pollution','inequality','the shortage of artificial burgers']) + '", says researcher'

        ])
      );

      //shuttlebay
      if(shuttlebay_state==1) telescope_list.push(choose([

        'Engineer\'s log: ' + choose(['a group of scientists','several chief engineers','several engineers']) + ' have ' + choose(['inspected the shuttlebay','ran a diagnostic on the shuttlebay doors','built a 3D model of the shuttlebay']),

        'Engineer\'s log: ' + choose(['"Ganges"','"Yangtzee Kiang"','"Mekong"','"Yukon"','"Rio Grande"']) + ' ' + choose(['was chosen as the shuttle of the month','is named the fastest shuttle in the fleet','had its engine replaced as part of maintenance','suffered a loss of power. Investigation is under way.','had its stripes painted '+choose(['red','blue','green','orange','black','purple','pink']),'had its seat design improved: now there\'s a coffee cup holder.','had its panels designed after the panels in Star Trek']),

        '"'+choose(['Which shuttle is your favorite?','Have you flown a shuttle?','Isn\'t the shuttlebay huge?'])+'" - intern',

        '<b>News:</b> Shuttlebay was chosen as a venue for ' + choose(['the Baseball World Cup '+getRandomInt(2051,2063),'a series of rock concerts','the latest installment of the Space Fair']),

        '<b>Announcement:</b> shuttlebay will be closed between '+ choose(['14:00 and 14:05','15:20 and 15:25','16:17 and 16:22','18:00 and 18:05','21:03 and 21:08']) +' for a short baryon sweep'

        ])
      );





    /*
        //
        telescope_list.push(choose([


          ])
        );
    */


    shuffleArray(telescope_list);
    //console.log(telescope_list);

  }
  function startTelescope(){

    var counter=0;

    Telescope();//build news items array
    telescope.html(telescope_list[0]);//immediately show something

    telescope_timer=setInterval(function() {

      counter++;

      if(counter>telescope_list.length-1){
        counter=0;
        Telescope();//re-build news items

      }

      telescope.html(telescope_list[counter]);

    }, 25000);
  }

  function SaveGame(){
    let gameData = {
      player: [money,money_limit,actions,total_money,all_time_money,actions_limit,version,magicnumber,chief],
      achievements: [actions_cycle,bonus_multiplier,researchList],
      ui: [audio_mute,audio_mute_one,audio_mute_two,audio_mute_three,audio_mute_four,audio_mute_allgen,audio_volume],
      upgrade_pbs: [one_upgrade_supply_limit_stage,two_upgrade_supply_limit_stage,three_upgrade_supply_limit_stage,four_upgrade_supply_limit_stage,one_upgrade_effectiveness_stage,two_upgrade_effectiveness_stage,three_upgrade_effectiveness_stage,four_upgrade_effectiveness_stage,one_upgrade_effectiveness_level,two_upgrade_effectiveness_level,three_upgrade_effectiveness_level,four_upgrade_effectiveness_level],
      prices: [one_upgrade_supply_limit_price,two_upgrade_supply_limit_price,three_upgrade_supply_limit_price,four_upgrade_supply_limit_price,one_upgrade_effectiveness_price,two_upgrade_effectiveness_price,three_upgrade_effectiveness_price,four_upgrade_effectiveness_price,one_upgrade_generation_price,two_upgrade_generation_price,three_upgrade_generation_price,four_upgrade_generation_price,money_limit_upgrade_price],
      generators: [one_generation,two_generation,three_generation,four_generation,one_price,two_price,three_price,four_price,one_init_multiplier,two_init_multiplier,three_init_multiplier,four_init_multiplier,one_multiplier,two_multiplier,three_multiplier,four_multiplier],
      machine_states:[battery_state,magnetron_state,foundry_state,shuttlebay_state,mc_state,station_state,lscanner_state,telescope_state],
      battery:[charge,charge_limit,battery_charge_percentage,charge_limit_upgrade_price,battery_charge_percentage_limit,charge_throughput_upgrade_price,charge_throughput_magicnumber_flag],
      magnetron:[device_magnetron_multiplier,magnetron_duration,magnetron_multiplier_upgrade_price,magnetron_duration_upgrade_price],
      engden:[engden_state],
      lscanner:[lifeforms_collection,animal8_magicnumber_flag,recency],
      foundry:[foundry_components,foundry_components_multiplier,foundry_components_cycle_upgrade_price,fccu_stage,fccu_level],
      shuttlebay:[shuttle_fleet,bsu_stage,rsu_stage,build_shuttle_upgrade_price,repair_shuttle_upgrade_price,shuttle_capacity_upgrade_price,shuttle_capacity,shuttle_capacity_magicnumber_flag],
      mc:[mission_debris_launch_flag,mission_debris_amount,mission_debris_stage,mission_station_launch_flag,mission_station_status,mission_station_upgrade_price,mission_station_stage,mission_telescope_launch_flag,mission_telescope_status,mission_telescope_upgrade_price,mission_telescope_stage],
      telescope:[telescope_stars_amount,telescope_galaxies_amount,telescope_resolution,telescope_resolution_upgrade_price,telescope_magicnumber_flag],
      prestige: [prestige_multiplier,antimatter,all_time_antimatter,antimatter_cubes,antimatter_cubes_spent,warp_magicnumber_upgrade_flag,warp_max_magnetron_duration,warp_max_magnetron_multiplier,warp_magnetron_alerting,warp_maintenance_upgrade_price,warp_amplifier_upgrade_flag]
    };


    gameData=LZString.compressToBase64(JSON.stringify(gameData));
    gamesavedump.text(gameData);
    localStorage.setItem('machineryGameData', gameData);
  }

  function LoadGame(){
    let gameData=localStorage.getItem('machineryGameData');
    gamesavedump.text(gameData);
    gameData = JSON.parse(LZString.decompressFromBase64(gameData));

    //PLAYER
    money=Number(gameData.player[0]);
    money_limit=Number(gameData.player[1]);money_limit_label.text("["+numT(money_limit)+"]");
    money_limit_upgrade_price=Number(gameData.prices[12]);money_limit_upgrade.text("⌬" + numT(money_limit_upgrade_price));
    actions=parseInt(gameData.player[2]);
    total_money=Number(gameData.player[3]);
    all_time_money=Number(gameData.player[4]);
    actions_limit=Number(gameData.player[5]);

    if(version!=gameData.player[6]){
      incorrectsave_infobox.show().text("Game version is "+version+". Your save version is "+gameData.player[6]+ ". This might lead to incorrect behavior. Overwriting your save will hide this warning, but it is unlikely to fix the save.");
      if(!version){//for a rare use case when folks encountered a really early version of the game
        localStorage.removeItem("machineryGameData");
        reset_infobox.text("Game data reset, since you seemed to have a really old version of the save. Please, reload page.");
      }
    }

    magicnumber=parseInt(gameData.player[7]);magicnumber_label.text("["+magicnumber+"]");
    chief=parseInt(gameData.player[8]);

    if(actions==actions_limit){button2Enable(actions_upgrade);}
    else{button2Disable(actions_upgrade);}

    //this is called early, since many different variables will depend on lifeform multipliers
    lifeforms_collection=gameData.lscanner[0];
    animal8_magicnumber_flag=gameData.lscanner[1];
    recency=gameData.lscanner[2];

      buildLifeformsCollection();

    //research lab goes here, since it requires recency
    actions_cycle=parseInt(gameData.achievements[0]);
    bonus_multiplier=parseFloat(gameData.achievements[1]);
    researchList=gameData.achievements[2];
      buildResearchList();


    //GENERATOR PRICES (SUPPLY LIMITS)
    one_price=Number(gameData.generators[4]);button_one.text(numT(one_price));
    two_price=Number(gameData.generators[5]);button_two.text(numT(two_price));
    three_price=Number(gameData.generators[6]);button_three.text(numT(three_price));
    four_price=Number(gameData.generators[7]);button_four.text(numT(four_price));

    //GENERATOR BUTTONS
    button1Enable(button_one);
    if(two_price>0){button1Enable(button_two);}else{button1Disable(button_two);}
    if(three_price>0){button1Enable(button_three);}else{button1Disable(button_three);}
    if(four_price>0){button1Enable(button_four);}else{button1Disable(button_four);}

    //init multipliers
    one_init_multiplier=Number(gameData.generators[8]);
    two_init_multiplier=Number(gameData.generators[9]);
    three_init_multiplier=Number(gameData.generators[10]);
    four_init_multiplier=Number(gameData.generators[11]);

    //MULTIPLIERS
    one_multiplier=Number(gameData.generators[12]);one_effectiveness_label.text("["+numT(one_multiplier)+"]");
    two_multiplier=Number(gameData.generators[13]);two_effectiveness_label.text("["+numT(two_multiplier)+"]");
    three_multiplier=Number(gameData.generators[14]);three_effectiveness_label.text("["+numT(three_multiplier)+"]");
    four_multiplier=Number(gameData.generators[15]);four_effectiveness_label.text("["+numT(four_multiplier)+"]");

    one_recent_money=0;
    two_recent_money=0;
    three_recent_money=0;
    four_recent_money=0;

    //UPGRADES DEFAULTS

    one_supply=0;one_supply_label.text(one_supply);
    two_supply=0;two_supply_label.text(two_supply);
    three_supply=0;three_supply_label.text(three_supply);
    four_supply=0;four_supply_label.text(four_supply);

    one_generation=parseInt(gameData.generators[0]);
          one_generation_label.text("Generation " + romanize(one_generation+1));
          if(one_generation>1)one_name_label.text("Electric " + romanize(one_generation));
    two_generation=parseInt(gameData.generators[1]);
          two_generation_label.text("Generation " + romanize(two_generation+1));
          if(two_generation>1)two_name_label.text("Plasma " + romanize(two_generation));
    three_generation=parseInt(gameData.generators[2]);
          three_generation_label.text("Generation " + romanize(three_generation+1));
          if(three_generation>1)three_name_label.text("Nuclear " + romanize(three_generation));
    four_generation=parseInt(gameData.generators[3]);
          four_generation_label.text("Generation " + romanize(four_generation+1));
          if(four_generation>1)four_name_label.text("Gravity " + romanize(four_generation));

    one_ratio_label.text("0%");
    two_ratio_label.text("0%");
    three_ratio_label.text("0%");
    four_ratio_label.text("0%");

    //generator prices

    one_upgrade_supply_limit_price=Number(gameData.prices[0]);
          one_upgrade_supply_limit.text("⌬" + numT(one_upgrade_supply_limit_price));
    two_upgrade_supply_limit_price=Number(gameData.prices[1]);
          two_upgrade_supply_limit.text("⌬" + numT(two_upgrade_supply_limit_price));
    three_upgrade_supply_limit_price=Number(gameData.prices[2]);
          three_upgrade_supply_limit.text("⌬" + numT(three_upgrade_supply_limit_price));
    four_upgrade_supply_limit_price=Number(gameData.prices[3]);
          four_upgrade_supply_limit.text("⌬" + numT(four_upgrade_supply_limit_price));

    one_upgrade_effectiveness_price=Number(gameData.prices[4]);
          one_upgrade_effectiveness.text("⌬" + numT(one_upgrade_effectiveness_price));
    two_upgrade_effectiveness_price=Number(gameData.prices[5]);
          two_upgrade_effectiveness.text("⌬" + numT(two_upgrade_effectiveness_price));
    three_upgrade_effectiveness_price=Number(gameData.prices[6]);
          three_upgrade_effectiveness.text("⌬" + numT(three_upgrade_effectiveness_price));
    four_upgrade_effectiveness_price=Number(gameData.prices[7]);
          four_upgrade_effectiveness.text("⌬" + numT(four_upgrade_effectiveness_price));

    //generator generations (each next is x1000)
    one_upgrade_generation_price=Number(gameData.prices[8]);
          one_upgrade_generation.text("⌬" + numT(one_upgrade_generation_price));
    two_upgrade_generation_price=Number(gameData.prices[9]);
          two_upgrade_generation.text("⌬" + numT(two_upgrade_generation_price));
    three_upgrade_generation_price=Number(gameData.prices[10]);
          three_upgrade_generation.text("⌬" + numT(three_upgrade_generation_price));
    four_upgrade_generation_price=Number(gameData.prices[11]);
          four_upgrade_generation.text("⌬" + numT(four_upgrade_generation_price));

          //check if the next iteration puts the price over the next generation price and hide the button. This is done only in LoadGame(), because this situation cannot occur with Init()
          if(Math.floor(one_upgrade_effectiveness_price + one_upgrade_effectiveness_price*egr)>one_upgrade_generation_price){
            one_upgrade_effectiveness.css("visibility", "hidden");
          }
          if(Math.floor(two_upgrade_effectiveness_price + two_upgrade_effectiveness_price*egr)>two_upgrade_generation_price){
            two_upgrade_effectiveness.css("visibility", "hidden");
          }
          if(Math.floor(three_upgrade_effectiveness_price + three_upgrade_effectiveness_price*egr)>three_upgrade_generation_price){
            three_upgrade_effectiveness.css("visibility", "hidden");
          }
          if(Math.floor(four_upgrade_effectiveness_price + four_upgrade_effectiveness_price*egr)>four_upgrade_generation_price){
            four_upgrade_effectiveness.css("visibility", "hidden");
          }

    //UPGRADE STAGES
    var label="";
    one_upgrade_supply_limit_stage=parseInt(gameData.upgrade_pbs[0]);
          if(one_upgrade_supply_limit_stage==80){label="x2";}
          else{label="+1";}
          progress3(one_upgrade_supply_limit_stage,pb_one_upgrade_supply_limit,pb_one_supply_indicator,label);
    two_upgrade_supply_limit_stage=parseInt(gameData.upgrade_pbs[1]);
          if(two_upgrade_supply_limit_stage==80){label="x2";}
          else{label="+1";}
          progress3(two_upgrade_supply_limit_stage,pb_two_upgrade_supply_limit,pb_two_supply_indicator,label);
    three_upgrade_supply_limit_stage=parseInt(gameData.upgrade_pbs[2]);
          if(three_upgrade_supply_limit_stage==80){label="x2";}
          else{label="+1";}
          progress3(three_upgrade_supply_limit_stage,pb_three_upgrade_supply_limit,pb_three_supply_indicator,label);
    four_upgrade_supply_limit_stage=parseInt(gameData.upgrade_pbs[3]);
          if(four_upgrade_supply_limit_stage==80){label="x2";}
          else{label="+1";}
          progress3(four_upgrade_supply_limit_stage,pb_four_upgrade_supply_limit,pb_four_supply_indicator,label);

    one_upgrade_effectiveness_level=parseInt(gameData.upgrade_pbs[8]);
    two_upgrade_effectiveness_level=parseInt(gameData.upgrade_pbs[9]);
    three_upgrade_effectiveness_level=parseInt(gameData.upgrade_pbs[10]);
    four_upgrade_effectiveness_level=parseInt(gameData.upgrade_pbs[11]);

    one_upgrade_effectiveness_stage=parseInt(gameData.upgrade_pbs[4]);
          if(one_upgrade_effectiveness_stage==96){
            if(one_upgrade_effectiveness_level % 2 === 0){label="x100";}
            else{label="x5";}
          }
          else{label="+"+numT(one_init_multiplier);}
          progress3(one_upgrade_effectiveness_stage,pb_one_upgrade_effectiveness,pb_one_effectiveness_indicator,label);
    two_upgrade_effectiveness_stage=parseInt(gameData.upgrade_pbs[5]);
          if(two_upgrade_effectiveness_stage==96){
            if(two_upgrade_effectiveness_level % 2 === 0){label="x100";}
            else{label="x5";}
          }
          else{label="+"+numT(two_init_multiplier);}
          progress3(two_upgrade_effectiveness_stage,pb_two_upgrade_effectiveness,pb_two_effectiveness_indicator,label);
    three_upgrade_effectiveness_stage=parseInt(gameData.upgrade_pbs[6]);
          if(three_upgrade_effectiveness_stage==96){
            if(three_upgrade_effectiveness_level % 2 === 0){label="x100";}
            else{label="x5";}
          }
          else{label="+"+numT(three_init_multiplier);}
          progress3(three_upgrade_effectiveness_stage,pb_three_upgrade_effectiveness,pb_three_effectiveness_indicator,label);
    four_upgrade_effectiveness_stage=parseInt(gameData.upgrade_pbs[7]);
          if(four_upgrade_effectiveness_stage==96){
            if(four_upgrade_effectiveness_level % 2 === 0){label="x100";}
            else{label="x5";}
          }
          else{label="+"+numT(four_init_multiplier);}
          progress3(four_upgrade_effectiveness_stage,pb_four_upgrade_effectiveness,pb_four_effectiveness_indicator,label);



          //MACHINE STATES
          battery_state=parseInt(gameData.machine_states[0]);
              if(battery_state==1){

                batteryInit();

                charge_limit=Number(gameData.battery[1]);charge_limit_label.text("["+numT(charge_limit)+"]");
                charge_limit_upgrade_price=Number(gameData.battery[3]);charge_limit_upgrade.text("⑂" + numT(charge_limit_upgrade_price));
                charge_throughput_upgrade_price=Number(gameData.battery[5]);charge_throughput_upgrade.text("⑂" + numT(charge_throughput_upgrade_price));
                charge=Number(gameData.battery[0]);progress_battery();

                  //animal multipler
                  if((animal7_battery_charge_multiplier-1)>0){animal7_battery_charge_multiplier_label.text('x'+(Math.round((animal7_battery_charge_multiplier-1)*100))+'%');}else{animal7_battery_charge_multiplier_label.text('');}

                battery_charge_percentage_limit=parseInt(gameData.battery[4]);charge_throughput_label.text("["+battery_charge_percentage_limit+"%]");
                battery_charge_percentage=parseInt(gameData.battery[2]);battery_charge_percentage_label.text(battery_charge_percentage+"%");

                charge_throughput_magicnumber_flag=gameData.battery[6];

                if(battery_charge_percentage_limit>=100){charge_throughput_upgrade.hide();}

              }else{//if not, then set up the proper unlock price
                battery_unlock_upgrade_price=Math.pow(10,13);battery_unlock_upgrade.text("⌬" + numT(battery_unlock_upgrade_price));
              }
          magnetron_state=parseInt(gameData.machine_states[1]);
          //relevant prestige items
          warp_max_magnetron_duration=parseInt(gameData.prestige[6]);
          warp_max_magnetron_multiplier=parseInt(gameData.prestige[7]);
          warp_magnetron_alerting=parseInt(gameData.prestige[8]);
              if(magnetron_state>0){//magnetron_state=2 is when the magnetron is armed, but we don't restore it. Instead, magnetronInit sets it to 1 again

                magnetronInit();

                device_magnetron_multiplier=parseInt(gameData.magnetron[0]);magnetron_multiplier_label.text("[x"+device_magnetron_multiplier+"]");
                magnetron_button.text("x"+device_magnetron_multiplier);
                  //animal multipler
                  if(animal3_magnetron_multiplier>0){animal3_magnetron_multiplier_label.text('+'+animal3_magnetron_multiplier);}
                  else{animal3_magnetron_multiplier_label.text('');}
                magnetron_multiplier_upgrade_price=Number(gameData.magnetron[2]);magnetron_multiplier_upgrade.text("⑂" + numT(magnetron_multiplier_upgrade_price));
                if(device_magnetron_multiplier>=warp_max_magnetron_multiplier){magnetron_multiplier_upgrade.hide();}//then we hide the button

                magnetron_duration=parseInt(gameData.magnetron[1]);magnetron_duration_label.text("["+magnetron_duration+" sec]");
                  //animal multipler
                  if(animal2_magnetron_duration>0){animal2_magnetron_duration_label.text('+'+animal2_magnetron_duration);}
                  else{animal2_magnetron_duration_label.text('');}
                magnetron_duration_upgrade_price=Number(gameData.magnetron[3]);magnetron_duration_upgrade.text("⑂" + numT(magnetron_duration_upgrade_price));
                if(magnetron_duration>=warp_max_magnetron_duration){magnetron_duration_upgrade.hide();}

                magnetron_button.text("x"+(device_magnetron_multiplier+animal3_magnetron_multiplier));

              }else{//if not, then set up the proper unlock price
                //I had a line here, but actually the previous machine's Init function will set this price properly
              }
          foundry_state=parseInt(gameData.machine_states[2]);
              if(foundry_state==1){

                var foundry_label;

                foundryInit();

                foundry_components=Number(gameData.foundry[0]);foundry_components_label.text("⯎" + numT(foundry_components));
                foundry_components_multiplier=Number(gameData.foundry[1]);foundry_components_multiplier_label.text("["+numT(foundry_components_multiplier)+"]");

                //animal multipler
                if((animal6_components_multiplier-1)>0){animal6_components_multiplier_label.text('x'+(Math.round((animal6_components_multiplier-1)*100))+'%');}else{animal6_components_multiplier_label.text('');}

                foundry_components_cycle_upgrade_price=Number(gameData.foundry[2]);foundry_components_cycle_upgrade.text("⑂" + numT(foundry_components_cycle_upgrade_price));

                fccu_stage=parseInt(gameData.foundry[3]);
                fccu_level=parseInt(gameData.foundry[4]);

                if(fccu_stage==95){

                  if(fccu_level % 2 === 0){foundry_label="x20";}
                  else{foundry_label="x5";}

                }
                else{foundry_label="+1";}

                progress3(fccu_stage,pb_components_multiplier,pb_components_multiplier_indicator,foundry_label);

              }
          shuttlebay_state=parseInt(gameData.machine_states[3]);
              if(shuttlebay_state==1){

                shuttlebayInit();

                shuttle_fleet=gameData.shuttlebay[0];

                shuttle_capacity_upgrade_price=Number(gameData.shuttlebay[5]);shuttle_capacity_upgrade.text("⯎" + numT(shuttle_capacity_upgrade_price));
                shuttle_capacity=Number(gameData.shuttlebay[6]);
                if(shuttle_capacity>=1000000){shuttle_capacity=1000000;shuttle_capacity_upgrade.hide();}
                shuttle_capacity_upgrade_label.text("["+numT(shuttle_capacity)+"]");

                bsu_stage=parseInt(gameData.shuttlebay[1]);
                build_shuttle_upgrade_price=Number(gameData.shuttlebay[3]);build_shuttle_upgrade.text("⯎" + numT(build_shuttle_upgrade_price));

                rsu_stage=parseInt(gameData.shuttlebay[2]);
                repair_shuttle_upgrade_price=Number(gameData.shuttlebay[4]);repair_shuttle_upgrade.text("⯎" + numT(repair_shuttle_upgrade_price));

                shuttle_capacity_magicnumber_flag=gameData.shuttlebay[7];

                var label=bsu_stage+'%';
                if(bsu_stage==0){label='';}

                progress3(bsu_stage,pb_build_shuttle,pb_build_shuttle_indicator,label);
                progress3(rsu_stage,pb_repair_shuttle,pb_repair_shuttle_indicator);

                drawShuttles();

                if(shuttlesBuiltCheck()>=5){
                  build_shuttle_row.hide();
                }

              }
          mc_state=parseInt(gameData.machine_states[4]);
              if(mc_state==1){

                mcInit();

                mission_debris_amount=parseInt(gameData.mc[1]);
                mission_debris_stage=parseInt(gameData.mc[2]);

                mission_station_status=parseInt(gameData.mc[4]);
                mission_station_upgrade_price=Number(gameData.mc[5]);
                mission_station_stage=parseInt(gameData.mc[6]);

                mission_telescope_status=parseInt(gameData.mc[8]);
                mission_telescope_upgrade_price=Number(gameData.mc[9]);
                mission_telescope_stage=parseInt(gameData.mc[10]);

                //we place these here, so that if missions are complete, they can override some of these values
                mission_debris_upgrade_label.text("Debris detected: " + mission_debris_amount);
                mission_station_upgrade_label.text("Deployment status: " + mission_station_status + '%');
                mission_telescope_upgrade_label.text("Deployment status: " + mission_telescope_status + '%');
                mission_station_upgrade.text( "⯎" +  numT(mission_station_upgrade_price) );
                mission_telescope_upgrade.text( "⯎" +  numT(mission_telescope_upgrade_price) );


                //MISSIONS

                //DEBRIS
                mission_debris_launch_flag=parseInt(gameData.mc[0]);

                if(mission_debris_launch_flag==1){
                  mission_debris_launch.hide();
                  mission_debris_block_progress.show();
                  redToGreen(mission_debris_upgrade_label);

                  mission_debris_shuttle_name.text('"'+obtainShuttleName(101)+'"');
                }
                if(mission_debris_launch_flag==2){//mission complete and at this point mission_debris_launch_flag=2
                  mission_debris_amount=0;
                  redToGreen(mission_debris_upgrade_label);
                  mission_debris_launch.hide();//we also need to make sure to hide the launch button
                  mission_debris_block_progress.hide();
                  mission_debris_upgrade_label.text("Mission complete");
                  mission_debris_launch_flag=2;//mission complete (this is used as a flag for moneyCalc() )
                }

                //DEPLOY SPACE STATION
                mission_station_launch_flag=parseInt(gameData.mc[3]);

                if(mission_station_launch_flag==1){
                  mission_station_launch.hide();
                  mission_station_block_progress.show();
                  redToGreen(mission_station_upgrade_label);

                  mission_station_shuttle_name.text('"'+obtainShuttleName(102)+'"');
                }
                if(mission_station_launch_flag==2){//mission complete
                  mission_station_status=100;
                  mission_station_launch.hide();
                  mission_station_block_progress.hide();
                  mission_station_upgrade_label.text("Mission complete");
                  redToGreen(mission_station_upgrade_label);
                }

                //DEPLOY ORBITAL TELESCOPE
                mission_telescope_launch_flag=parseInt(gameData.mc[7]);

                if(mission_telescope_launch_flag==1){
                  mission_telescope_launch.hide();
                  mission_telescope_block_progress.show();
                  redToGreen(mission_telescope_upgrade_label);

                  mission_telescope_shuttle_name.text('"'+obtainShuttleName(103)+'"');
                }
                if(mission_telescope_launch_flag==2){//mission complete
                  mission_telescope_status=100;
                  mission_telescope_launch.hide();
                  mission_telescope_block_progress.hide();
                  mission_telescope_upgrade_label.text("Mission complete");
                  redToGreen(mission_telescope_upgrade_label);
                }

                //note: for some reason putting them before handling missions doesn't update the progress bars correctly, I suspect because they are hidden, but not sure, might confirm later
                progress3(mission_debris_stage,pb_mission_debris,pb_mission_debris_indicator,'');
                progress3(mission_station_stage,pb_mission_station,pb_mission_station_indicator,'');
                progress3(mission_telescope_stage,pb_mission_telescope,pb_mission_telescope_indicator,'');



                station_unlock_upgrade.html(mission_station_status+'%');
                telescope_unlock_upgrade.html(mission_telescope_status+'%');

              }

              station_state=parseInt(gameData.machine_states[5]);
                  if(station_state==1){
                    //we don't do anything else here, because in 0.99 there's nothing else to the station
                    stationInit();
                  }

              telescope_state=parseInt(gameData.machine_states[7]);
                  if(telescope_state==1){

                    telescopeInit();

                    telescope_stars_amount=Number(gameData.telescope[0]);
                    telescope_stars_amount_label.text('['+telescope_stars_amount+'/1000000000000]');

                    telescope_galaxies_amount=Number(gameData.telescope[1]);
                    telescope_galaxies_amount_label.text('['+numT(telescope_galaxies_amount)+']');

                    telescope_resolution=Number(gameData.telescope[2]);
                    telescope_resolution_label.text('[1-'+telescope_resolution+']');

                    telescope_resolution_upgrade_price=Number(gameData.telescope[3]);
                    telescope_resolution_upgrade.text( "⯎" +  numT(telescope_resolution_upgrade_price) );

                    telescope_magicnumber_flag=parseInt(gameData.telescope[4]);

                  }



              //upgrades related to rank (engineering den and lifeforms scanner)
              engden_state=parseInt(gameData.engden[0]);
                  if(engden_state==0){
                    engden_title.hide();
                    engden_block.hide();
                    rank_label.text("[Operator]");
                  }else{
                    engden_title.show();
                    engden_block.show();
                    rank_label.text("[Engineer]");
                  }
                  auxiliary_effectiveness1=0;
                  auxiliary_effectiveness2=0;
              lscanner_state=parseInt(gameData.machine_states[6]);
                  if(lscanner_state==0){
                    lscanner_title.hide();
                    lscanner_block.hide();
                  }else{
                    lscanner_title.show();
                    lscanner_block.show();
                    rank_label.text("[Floor Admin]");
                  }
              if(chief==1){//chief is taken from the save in the beginning of LoadGame(), with the other player variables
                rank_label.text("[Chief Engineer]");
              }



    //CONTROL PANEL
    one_tab.css("background-color","#30b8d0");one_tab.css("color","#1a1a1a");
    two_tab.css("background-color","#1a1a1a");two_tab.css("color","#999");
    three_tab.css("background-color","#1a1a1a");three_tab.css("color","#999");
    four_tab.css("background-color","#1a1a1a");four_tab.css("color","#999");

    one_tab_contents.show();
    two_tab_contents.hide();
    three_tab_contents.hide();
    four_tab_contents.hide();

    //bonusbox.hide();bonusbox_window_flag=0;

    //OPTIMIZATIONS
    active_tab_flag=1;
    one_ratios_flag=1;//1 by default, so that starting the generator recalculates the ratios
    two_ratios_flag=1;
    three_ratios_flag=1;
    four_ratios_flag=1;

    //GENERATOR STRIPS
    one_x=0;two_x=0;three_x=0;four_x=0;
    g_electric.css('background-image', 'url("img/g_electric2.png")');
    g_plasma.css('background-image', 'url("img/g_plasma2.png")');
    g_nuclear.css('background-image', 'url("img/g_nuclear2.png")');
    g_gravity.css('background-image', 'url("img/g_gravity2.png")');

    //PRESTIGE ITEMS that are not specific to machines; machine-specific prestige items are loaded before their relevant sections ^^^
    prestige_multiplier=Number(gameData.prestige[0]);
    antimatter=Number(gameData.prestige[1]);
    all_time_antimatter=Number(gameData.prestige[2]);
    antimatter_cubes=Number(gameData.prestige[3]);
    antimatter_cubes_spent=Number(gameData.prestige[4]);
    warp_magicnumber_upgrade_flag=parseInt(gameData.prestige[5]);
    warp_maintenance_upgrade_price=Number(gameData.prestige[9]);
      if(gameData.prestige[10]){warp_amplifier_upgrade_flag=Number(gameData.prestige[10]);}
      else{warp_amplifier_upgrade_flag=0;}


      //calculating nextAntimatterCost and prevAntimatterCost
      if(antimatter_cubes==0){//if the player's warp level is 0, we set the defaults
        prevAntimatterCost=0;
        nextAntimatterCost=1000000000000;//strictly speaking, this is not necessary, since nAC() is called in InventoryUpdate and it will set it
      }else{//if we are at a non-zero warp level, we calculate the costs based on the amount of warp levels

        prevAntimatterCost=Math.pow(10,12) * Math.pow((all_time_antimatter),3);
        nextAntimatterCost=Math.pow(10,12) * Math.pow((all_time_antimatter+1),3);
        antimatter_label.text(numT(antimatter));
      }





    //AUDIO
    audio_mute=parseInt(gameData.ui[0]);
          if(audio_mute==0){
            audio_toggle.text("Mute audio");
            button3Green(audio_toggle);
          }else{
            audio_toggle.text("Unmute audio");
            button3Red(audio_toggle);
          }
    audio_mute_one=parseInt(gameData.ui[1]);
          if(audio_mute_one==0){
            audio_toggle_one.text("Mute Electric");
            button3Green(audio_toggle_one);
          }else{
            audio_toggle_one.text("Unmute Electric");
            button3Red(audio_toggle_one);
          }
    audio_mute_two=parseInt(gameData.ui[2]);
          if(audio_mute_two==0){
            audio_toggle_two.text("Mute Plasma");
            button3Green(audio_toggle_two);
          }else{
            audio_toggle_two.text("Unmute Plasma");
            button3Red(audio_toggle_two);
          }
    audio_mute_three=parseInt(gameData.ui[3]);
          if(audio_mute_three==0){
            audio_toggle_three.text("Mute Nuclear");
            button3Green(audio_toggle_three);
          }else{
            audio_toggle_three.text("Unmute Nuclear");
            button3Red(audio_toggle_three);
          }
    audio_mute_four=parseInt(gameData.ui[4]);
          if(audio_mute_four==0){
            audio_toggle_four.text("Mute Gravity");
            button3Green(audio_toggle_four);
          }else{
            audio_toggle_four.text("Unmute Gravity");
            button3Red(audio_toggle_four);
          }
    audio_mute_allgen=parseInt(gameData.ui[5]);
          if(audio_mute_allgen==0){
            audio_toggle_allgen.text("Mute All");
            button3Green(audio_toggle_allgen);
          }else{
            audio_toggle_allgen.text("Unmute All");
            button3Red(audio_toggle_allgen);
          }
    audio_volume=parseFloat(gameData.ui[6]);
    Howler.volume(audio_volume);
    audio_control_volume.val(audio_volume);


    //multipliers that are always part of moneyCalc set to default values
    magnetron_multiplier=1;
    auxiliary_effectiveness=1;

    //updating UI with the established values
    InventoryUpdate();
    factoryState();//because it is called in Inventory only if battery_charge_percentage is over 0, which might not be the case on load
    ActionsUpdate();

    buildResearchList();

    //starting the Grand Telescope
    startTelescope();

    clearInterval(save_timer);
    save_timer_label.text(120);
    button3Disable(save_upgrade);
    setTimeout('SaveLoop();',1000);

  }

  function SaveLoop(){

    save_sec=120;

    save_timer=setInterval(function() {

      save_sec--;
      if(save_sec==0){
        save_sec=120;
        SaveGame();
        button3Disable(save_upgrade);
      }

      if(save_sec==110){button3Enable(save_upgrade);}

      save_timer_label.text(save_sec);

    }, 1000);

  }

  function button1Enable($element){
    $element.prop('disabled', false).removeClass('disabled1').addClass('button1');
  }
  function button1Disable($element){
    $element.prop('disabled', true).removeClass('button1').addClass('disabled1');
  }
  function button2Enable($element){
    $element.prop('disabled', false).removeClass('disabled2').addClass('button2');
  }
  function button2Disable($element){
    $element.prop('disabled', true).removeClass('button2').addClass('disabled2');
  }
  function button3Enable($element){
    $element.prop('disabled', false).removeClass('disabled3').addClass('button3');
  }
  function button3Disable($element){
    $element.prop('disabled', true).removeClass('button3').addClass('disabled3');
  }
  function button3Green($element){
    $element.removeClass('button3red').addClass('button3green');
  }
  function button3Red($element){
    $element.removeClass('button3green').addClass('button3red');
  }
  function button7Enable($element){
    $element.prop('disabled', false).removeClass('disabled7').addClass('button7');
  }
  function button7Disable($element){
    $element.prop('disabled', true).removeClass('button7').addClass('disabled7');
  }
  function magnetron_buttonEnable(){
    magnetron_button.prop('disabled', false).removeClass('magnetron_button_disarmed').addClass('magnetron_button_armed');
  }
  function magnetron_buttonActiveDisabled(){//the button is disabled, but we make sure that the button looks active
    magnetron_button.prop('disabled', true).removeClass('magnetron_button_armed').addClass('magnetron_button_timer');
  }
  function magnetron_buttonDisable(){
    magnetron_button.prop('disabled', true).removeClass('magnetron_button_timer').removeClass('magnetron_button_armed').addClass('magnetron_button_disarmed');
  }
  function bonusEnable($element){
    $element.prop('disabled', false).removeClass('bonusbox_disabled').addClass('bonusbox');
  }
  function bonusDisable($element){
    $element.prop('disabled', true).removeClass('bonusbox').addClass('bonusbox_disabled');
  }
  function redToGreen($element){
    $element.removeClass('red').addClass('green');
  }
  function greenToRed($element){
    $element.removeClass('green').addClass('red');
  }
  function silverToRedBold($element){

    $element.removeClass('silver').addClass('red_bold');
  }
  function redBoldToSilver($element){

    $element.removeClass('red_bold').addClass('silver');
  }

  function closeWindows(){//closes all the windows
    settings_infobox.hide();settings_window_flag=0;
    reset_infobox.hide();reset_window_flag=0;
    stats_infobox.hide();stats_window_flag=0;
    prestige_infobox.hide();prestige_window_flag=0;
    rank_infobox.hide();rankinfo_window_flag=0;
  }

  function numT(number, decPlaces=2) { //numTransform

    //my optimization: it used to do abbrev.length in two places, since the length here is not variable, I cache it. Performance boost is likely to be very small, but as this is one of the most used functions in the game, I want to make sure it is ultra-optimized

    var abbrev_length=48;

            number = Math.round(number*100)/100;//my addition: round any incoming floats first

  					// 2 decimal places => 100, 3 => 1000, etc
  					decPlaces = Math.pow(10,decPlaces);
  					// Enumerate number abbreviations
  					var abbrev = [ "k", "M", "B", "T", "q", "Q", "S", "kS", "o", "n", "d", "kd", "U", "Td", "Qt", "Qd", "Sd", "St", "O", "N", "v", "c", "Na", "kNa", "Nb", "kNb", "Nc", "kNc", "Nd", "kNd", "Ne", "kNe", "Nf", "kNf", "Ng", "kNg", "Nh", "kNh", "Ni", "kNi", "Nj", "kNj", "Nk", "kNk", "Nl", "kNl", "Nm", "kNm" ];

  					// Go through the array backwards, so we do the largest first
  					for (var i=abbrev_length-1; i>=0; i--) {
  							// Convert array index to "1000", "1000000", etc
  							var size = Math.pow(10,(i+1)*3);
  							// If the number is bigger or equal do the abbreviation
  							if(size <= number) {
  									 // Here, we multiply by decPlaces, round, and then divide by decPlaces.
  									 // This gives us nice rounding to a particular decimal place.
  									 number = Math.round(number*decPlaces/size)/decPlaces;
  									 // Handle special case where we round up to the next abbreviation
  									 if((number == 1000) && (i < abbrev_length - 1)) {
  											 number = 1;
  											 i++;
  									 }
  									 // Add the letter for the abbreviation
  									 number += ""+abbrev[i];
  									 // We are done... stop
  									 break;
  							}
  					}
  					return number;
  		}

  function romanize(num) {
  	if (!+num)
  		return false;
  	var	digits = String(+num).split(""),
  		key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
  		       "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
  		       "","I","II","III","IV","V","VI","VII","VIII","IX"],
  		roman = "",
  		i = 3;
  	while (i--)
  		roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  	return Array(+digits.join("") + 1).join("M") + roman;
  }

  function choose(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum and the minimum are inclusive
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function windowScroll(){
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  function progress(percent, $element) {
    var progressBarWidth = percent * pb_one_width * 0.01;
    $element.width(progressBarWidth);
  }

  function progress3(percent, $element, $element_indicator, label) {
    var progressBarWidth = percent * $element.width() * 0.01;
    $element_indicator.width(progressBarWidth).html(label);
  }

  function progress_antimatter() {

    var percent= (all_time_money - prevAntimatterCost) / (nextAntimatterCost - prevAntimatterCost) * 100;
    var progressBarWidth = percent * pb_antimatter.width() * 0.01;//have to do width, since it changes based on the amount of antimatter
    pb_antimatter_indicator.width(progressBarWidth);
  }

  function progress_money() {
    var percent= money / money_limit * 100;
    if(percent>100){percent=100;}
    var progressBarWidth = percent * pb_money.width() * 0.01;
    pb_money_indicator.width(progressBarWidth).html("⌬" + numT(money));
  }

  function progress_battery() {
    var percent= charge / charge_limit * 100;
    if(percent>100){percent=100;}
    var progressBarWidth = percent * pb_battery.width() * 0.01;
    pb_battery_indicator.width(progressBarWidth).html("⑂" + numT(charge));
  }
  //not being used
  function progress_foundry(percent) {
    //var percent= charge / charge_limit * 100;
    if(percent>100){percent=100;}
    var progressBarWidth = percent * pb_battery.width() * 0.01;
    pb_foundry_indicator.width(progressBarWidth);
  }

  function GeneratorRatios(){
    var all = one_recent_money + two_recent_money + three_recent_money + four_recent_money;
    var one_ratio = Math.floor(one_recent_money / all * 100); one_ratio_label.text(one_ratio+"%");
    var two_ratio = Math.floor(two_recent_money / all * 100); two_ratio_label.text(two_ratio+"%");
    var three_ratio = Math.floor(three_recent_money / all * 100); three_ratio_label.text(three_ratio+"%");
    var four_ratio = Math.floor(four_recent_money / all * 100); four_ratio_label.text(four_ratio+"%");
  }

  function nAC(){//nextAntimatterCost

    if(all_time_money>=nextAntimatterCost){

      let recalculated_ac=Math.floor( Math.cbrt( all_time_money/Math.pow(10,12) ) );//recalculating all time antimatter cubes

      all_time_antimatter=recalculated_ac;
      antimatter=recalculated_ac-antimatter_cubes;//this is the amount of antimatter earned this cycle
      antimatter_label.text(numT(antimatter));
      prevAntimatterCost=Math.pow(10,12) * Math.pow((all_time_antimatter),3);
    }
    nextAntimatterCost=Math.pow(10,12) * Math.pow((all_time_antimatter+1),3);

    //updating the progress bar
    progress_antimatter();
  }

  function setupAudio(){

    audio_tick2 = new Howl({
      src: ['snd/tick2.wav']
    });

    audio_click4 = new Howl({
      src: ['snd/click4.wav']
    });

    audio_click5 = new Howl({
      src: ['snd/click5.wav']
    });

    audio_pbtick = new Howl({
      src: ['snd/progress_tick2.wav']
    });

    audio_bonus = new Howl({
      src: ['snd/money2.wav']
    });

    audio_alert = new Howl({
      src: ['snd/blip1.wav']
    });

    audio_switch = new Howl({
      src: ['snd/switch2_2.wav']
    });

    audio_rlab = new Howl({
      src: ['snd/rlab_item1_2.wav']
    });

    audio_phum = new Howl({
      src: ['snd/phum_loop.wav']
    });

    audio_tabclick = new Howl({
      src: ['snd/tab_click.wav']
    });

  }

  function PlayAudio(snd){
    if(audio_mute==0){

      if(audio_initiated==0){
        audio_initiated=1;
        setupAudio();
      }

      switch(snd){
        case 1: audio_click4.play(); break;
        case 2: audio_click5.play(); break;
        case 3: audio_tick2.play(); break;
        case 4: audio_pbtick.play(); break;
        case 5: audio_bonus.play(); break;
        case 6: audio_alert.play(); break;
        case 7: audio_switch.play(); break;
        case 8: audio_rlab.play(); break;
        case 9: audio_phum.play(); break;
        case 10: audio_tabclick.play(); break;
        }
    }
    }