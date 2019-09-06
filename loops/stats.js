'use strict';
function initializeStats() {
    for(let i = 0; i < statList.length; i++) {
        addNewStat(statList[i]);
    }
}

function addNewStat(name) {
    stats[name] = {};
    stats[name].exp = 0;
    stats[name].talent = 0;
}

function initializeSkills() {
    for(let i = 0; i < skillList.length; i++) {
        addNewSkill(skillList[i]);
    }
}

function addNewSkill(name) {
    skills[name] = {};
    skills[name].exp = 0;
}

function initializeBuffs() {
    for(let i = 0; i < buffList.length; i++) {
        addNewBuff(buffList[i]);
    }
}

function addNewBuff(name) {
    buffs[name] = {};
    buffs[name].amt = 0;
}

function getLevel(stat) {
    return getLevelFromExp(stats[stat].exp);
}

function getTotalTalentLevel() {
    return Math.floor(Math.pow(totalTalent, 0.2));
}

function getTotalTalentPrc() {
    return (Math.pow(totalTalent, 0.2) - Math.floor(Math.pow(totalTalent, 0.2))) * 100;
}

function getLevelFromExp(exp) {
    return Math.floor((Math.sqrt(8*exp/100+1)-1)/2);
}

function getExpOfLevel(level) {
    return level * (level + 1) * 50;
}

function getTalent(stat) {
    return getLevelFromTalent(stats[stat].talent);
}

function getLevelFromTalent(exp) {
    return Math.floor((Math.sqrt(8*exp/100+1)-1)/2);
}

function getExpOfTalent(level) {
    return level * (level + 1) * 50;
}

function getPrcToNextLevel(stat) {
    let expOfCurLevel = getExpOfLevel(getLevel(stat));
    let curLevelProgress = stats[stat].exp - expOfCurLevel;
    let nextLevelNeeds = getExpOfLevel(getLevel(stat)+1) - expOfCurLevel;
    return Math.floor(curLevelProgress / nextLevelNeeds * 100 * 10) / 10
}

function getPrcToNextTalent(stat) {
    let expOfCurLevel = getExpOfTalent(getTalent(stat));
    let curLevelProgress = stats[stat].talent - expOfCurLevel;
    let nextLevelNeeds = getExpOfTalent(getTalent(stat)+1) - expOfCurLevel;
    return Math.floor(curLevelProgress / nextLevelNeeds * 100 * 10) / 10
}

function getSkillLevelFromExp(exp) {
    return Math.floor((Math.sqrt(8*exp/100+1)-1)/2);
}

function getExpOfSkillLevel(level) {
    return level * (level + 1) * 50;
}

function getSkillLevel(skill) {
    return getSkillLevelFromExp(skills[skill].exp);
}

function getBuffLevel(buff) {
    return buffs[buff].amt;
}

function getSelfCombat() {
    return (getSkillLevel("Combat") + getSkillLevel("Pyromancy") * 5) * (1 + (armor * getCraftGuildRank().bonus)/5);
}

function getTeamCombat() {
    return getSelfCombat("Combat") + getSkillLevel("Combat")*teamNum/2 * getAdvGuildRank().bonus;
}

function getPrcToNextSkillLevel(skill) {
    let expOfCurLevel = getExpOfSkillLevel(getSkillLevel(skill));
    let curLevelProgress = skills[skill].exp - expOfCurLevel;
    let nextLevelNeeds = getExpOfSkillLevel(getSkillLevel(skill)+1) - expOfCurLevel;
    return Math.floor(curLevelProgress / nextLevelNeeds * 100 * 10) / 10
}

function addSkillExp(name, amount) {
    skills[name].exp += amount;
    view.updateSkill(name);
}

function addBuffAmt(name, amount) {
    buffs[name].amt += amount;
    view.updateBuff(name);
}

function addExp(name, amount) {
    stats[name].exp += amount;
    stats[name].talent += amount / 100;
    totalTalent += amount / 100;
}

function restartStats() {
    for(let i = 0; i < statList.length; i++) {
        stats[statList[i]].exp = 0;
        view.updateStat(statList[i]);
    }
}

function getTotalBonusXP(statName) {
    let soulstoneBonus = stats[statName].soulstone ? calcSoulstoneMult(stats[statName].soulstone) : 1;
    return soulstoneBonus * calcTalentMult(getTalent(statName));
}
