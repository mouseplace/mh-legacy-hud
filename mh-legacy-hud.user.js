// ==UserScript==
// @name         🐭️ MouseHunt - Toggle Legacy HUD
// @version      1.0.0
// @description
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.2.0/mousehunt-utils.js
// ==/UserScript==
(function () {
  'use strict';

  const getMapText = () => {
    if (user.enviroment_atts.has_map) {
      return user.enviroment_atts.map_label;
    }

    const amount = user.quests.QuestRelicHunter.num_invites;
    if (amount > 1) {
      return `${amount} invites`;
    } else if (amount === 1) {
      return `${amount} invite`;
    }
    return 'Start new';
  };

  const legacyHudHtml = `<div class="headsup">
		<div class="shieldped">
			<div class="titleicon">
				<a href="#" onclick="hg.utils.PageUtil.setPage('Title'); return false;">
					<img src="${user.title_icon}" width="12" height="14" border="0" class="hud_titleIcon">
				</a>
			</div>
		</div>
		<div id="hud_statList1" class="hudstatlist">
			<ul>
				<li>
					<span class="hudstatlabel">Location:</span>
					<a href="#" class="hudstatvalue hud_location" onclick="hg.utils.PageUtil.setPage('Travel'); return false;">
						${user.environment_name}
					</a>
				</li>
				<li>
					<span class="hudstatlabel">Title:</span>
					<span class="hud_title">
						<a href="#" class="hudstatvalue" onclick="hg.utils.PageUtil.setPage('Title'); return false;">
							${user.title_name}
						</a>
					</span> (<span class="hud_titlePercentage">${user.title_percent}</span>%)
				</li>
				<li>
					<div class="mousehuntHud-titleProgressBar">
						<span class="dot"></span>
						<div class="wrapper">
							<span class="bar" style="width: ${user.title_percent}%;"></span>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div id="cheeseped" class="cheeseped">
			<a href="#" class="baiticon" target="_parent" onclick="hg.utils.PageUtil.setPage('Inventory', {tab:'cheese'}); return false;">
				<img id="hud_baitIcon" src="${user.bait_pedestal_image}" border="0" title="${user.bait_name} ${user.enviroment_atts.bait_quantity_formatted}" alt="Bait">
			</a>
		</div>
		<div class="hudstatlist legacyFix">
			<ul>
				<li class="mousehuntHud-userStat base" data-item-id="${user.base_item_id}">
					<span class="hudstatlabel">Base:</span>
					<span id="hud_base" class="hudstatvalue">
						<a href="#" class="label" onclick="hg.utils.PageUtil.setPage('Inventory', {tab:'traps', sub_tab:'base'}); return false;">
							${user.base_name}
						</a>
					</span>
				</li>
				<li class="mousehuntHud-userStat weapon" data-item-id="${user.weapon_item_id}">
					<span class="hudstatlabel">Weapon:</span>
					<span id="hud_weapon" class="hudstatvalue">
						<a href="#" class="label" onclick="hg.utils.PageUtil.setPage('Inventory', {tab:'traps', sub_tab:'weapon'}); return false;">
							${user.weapon_name}
						</a>
					</span>
				</li>
				<li class="mousehuntHud-userStat trinket " data-item-id="${user.trinket_item_id}">
					<span class="hudstatlabel">Charm:</span>
					<span class="label hudstatvalue">
						${user.trinket_name}
					</span>
				</li>
				<li class="mousehuntHud-userStat power hidden">
					<span class="hudstatlabel">Trap Power:</span>
					<span class="value hudstatvalue">${user.enviroment_atts.power_formatted}</span>
				</li>
			</ul>
		</div>
		<div class="hudstatlist legacyFix">
			<ul>
				<li>
					<span class="hudstatlabel">Gold:</span>
					<span class="hud_gold hudstatvalue">${user.enviroment_atts.gold_formatted}</span>
				</li>
				<li>
					<span class="hudstatlabel">Points:</span>
					<span class="hud_points hudstatvalue">${user.enviroment_atts.points_formatted}</span>
				</li>
				<li class="mousehuntHud-userStat bait " data-item-id="${user.bait_item_id}">
					<span class="hudstatlabel">Bait:</span>
					<span id="hud_baitName">
						<a href="#" class="label" onclick="hg.utils.PageUtil.setPage('Inventory', {tab:'cheese'}); return false;">
							${user.bait_name}
						</a>
					</span>
					<span class="hud_baitQuantity value">${user.bait_quantity}</span>
				</li>
			</ul>
		</div>
		<div class="hudstatlist">
			<ul>
				<li>
					<span class="hudstatlabel">Team:</span>
					<span id="hud_team">
						<a href="https://www.mousehuntgame.com/team.php?team_id=${user.team.id}" class="hud_team_name hudstatvalue" onclick="app.pages.TeamPage.showUserTeamPage(); return false;">
							${user.team.name}
						</a>
						<div class="corkboardUpdate "></div>
					</span>
				</li>
				<a class="mousehuntHud-userStat treasureMap ${user.enviroment_atts.has_map ? 'active' : 'empty'}" onclick="hg.controllers.TreasureMapController.show();return false;" href="#">
					<div class="icon" style="${user.enviroment_atts.has_map ? `background-image: url(${user.enviroment_atts.map_image})` : ''}">
						<div class="notification ${user.enviroment_atts.num_map_notifications ? 'active' : ''}">${user.enviroment_atts.num_map_notifications}</div>
						<div class="corkboardUpdate "></div>
						<div class="miceWarning "></div>
					</div>
					<span class="label">Treasure Maps</span>
					<span class="value">${getMapText()}</span>
				</a>
			</ul>
		</div>
		<div class="marblebevel"></div>
	</div>
	`;

  const makeOldMenu = () => {
    const body = document.querySelector('body');
    if (! body) {
      return;
    }

    const isLegacy = body.classList.contains('mh-legacy-mode');
    body.classList.toggle('mh-legacy-mode');

    const mpLink = document.querySelector('.mousehuntHud-marketPlace');
    if (mpLink) {
      if (isLegacy) {
        const oldCampButton = document.querySelector('#mh-legacy-mode-camp-button');
        if (oldCampButton) {
          oldCampButton.remove();
        }
      } else {
        const oldCampButton = document.createElement('a');
        oldCampButton.id = 'mh-legacy-mode-camp-button';
        oldCampButton.href = 'https://www.mousehuntgame.com/';
        oldCampButton.classList.add('mousehuntHud-campButton', 'mh-legacy-mode-add');
        oldCampButton.onclick = function () {
          hg.utils.PageUtil.setPage('Camp');
          return false;
        };

        mpLink.parentNode.insertBefore(oldCampButton, mpLink.nextSibling);
      }
    }

    const menu = document.querySelector('.mousehuntHud-menu');
    if (menu) {
      if (isLegacy) {
        menu.classList.remove('legacy');
        menu.classList.add('default');
      } else {
        menu.classList.remove('default');
        menu.classList.add('legacy');
      }
    }

    const timer = document.querySelector('.huntersHornView__timer');
    if (timer) {
      if (isLegacy) {
        timer.classList.remove('huntersHornView__timer--legacy');
        timer.classList.add('huntersHornView__timer--default');
      } else {
        timer.classList.remove('huntersHornView__timer--default');
        timer.classList.add('huntersHornView__timer--legacy');
      }
    }

    const kingdomMenu = document.querySelector('.mousehuntHud-menu .kingdom');
    const friendsMenu = document.querySelector('.mousehuntHud-menu .friends');
    if (kingdomMenu && friendsMenu) {
      if (isLegacy) {
        const teams = document.querySelector('#mh-legacy-mode-teams');
        if (teams) {
          teams.remove();
        }

        const lore = document.querySelector('#mh-legacy-mode-lore');
        if (lore) {
          lore.remove();
        }

        kingdomMenu.classList.add('hasChildren');
      } else {
        const teams = friendsMenu.cloneNode(true);
        teams.id = 'mh-legacy-mode-teams';
        teams.classList.remove('friends');
        teams.classList.add('team', 'mh-legacy-mode-add');

        kingdomMenu.parentNode.insertBefore(teams, kingdomMenu.nextSibling);

        const lore = kingdomMenu.cloneNode(true);
        lore.id = 'mh-legacy-mode-lore';
        lore.classList.remove('kingdom');
        lore.classList.add('scoreboards', 'mh-legacy-mode-add');

        kingdomMenu.parentNode.insertBefore(lore, kingdomMenu.nextSibling);
      }
    }

    const hudStats = document.querySelector('.headsUpDisplayView-stats');
    if (hudStats) {
      if (isLegacy) {
        const legacyHud = document.querySelector('#mh-legacy-mode-hud');
        if (legacyHud) {
          legacyHud.remove();
        }
      } else {
        const legacyHud = document.createElement('div');
        legacyHud.id = 'mh-legacy-mode-hud';
        legacyHud.classList.add('headsup');
        legacyHud.innerHTML = legacyHudHtml;

        hudStats.parentNode.insertBefore(legacyHud, hudStats.nextSibling);
      }
    }
  };

  const makeToggleLink = () => {
    const topSettingsLink = document.querySelector('.mousehuntHeaderView-dropdownContainer .menuItem.settings');
    if (! topSettingsLink) {
      return;
    }

    const toggleLink = document.createElement('a');
    toggleLink.classList.add('menuItem');
    toggleLink.href = '#';
    toggleLink.innerHTML = 'Toggle Legacy HUD';
    toggleLink.addEventListener('click', makeOldMenu);

    topSettingsLink.parentNode.insertBefore(toggleLink, topSettingsLink);
  };

  addStyles(`.mh-legacy-mode .mousehuntHud-userStatBar,
	.mh-legacy-mode .mousehuntHud-environment,
	.mh-legacy-mode .mousehuntHud-menu .camp,
	.mh-legacy-mode .mousehuntHud-menu .friends .team,
	.mh-legacy-mode .mousehuntHud-menu .friends .tournaments,
	.mh-legacy-mode .mousehuntHud-menu .friends .tournament_scoreboards,
	.mh-legacy-mode .mousehuntHud-menu .team .friend_list,
	.mh-legacy-mode .mousehuntHud-menu .team .hunter_community,
	.mh-legacy-mode .mousehuntHud-menu .team .community_maps,
	.mh-legacy-mode .mousehuntHud-menu .team .free_gifts,
	.mh-legacy-mode .mousehuntHud-menu .team .send_supplies,
	.mh-legacy-mode .mousehuntHud-menu .scoreboards .forum,
	.mh-legacy-mode .mousehuntHud-menu .scoreboards .news,
	.mh-legacy-mode .mousehuntHud-menu .kingdom .wiki,
	.mh-legacy-mode .mousehuntHud-menu .kingdom .guide,
	.mh-legacy-mode .mousehuntHud-menu .kingdom .feedback_friday,
	.mh-legacy-mode .mousehuntHud-menu .kingdom .merch_store {
		display: none;
	}`);

  makeToggleLink();
}());
