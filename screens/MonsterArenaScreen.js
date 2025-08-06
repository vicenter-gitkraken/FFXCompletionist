import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MonsterArenaScreen = () => {
  // Sample data based on your table - you can expand this
  const [areasData, setAreasData] = useState([
    {
      id: 1,
      zona: "Besaid",
      objetivo: "99 Pócimas de Salud",
      monsters: [
        {
          name: "Condor",
          required: 10,
          captured: 0,
          completed: false
        },
        {
          name: "Dingo",
          required: 10,
          captured: 0,
          completed: false
        },
        {
          name: "Flan de Agua",
          required: 10,
          captured: 0,
          completed: false
        }
      ],
      soborno: "1,900 Gil",
      objetoSoborno: "3 Bombas de Humo",
      areaCompleted: false,
      expanded: true // Start expanded for demo
    },
    {
      id: 2,
      zona: "Kilika",
      objetivo: "99 Antídotos",
      monsters: [
        {
          name: "Dinonix",
          required: 10,
          captured: 0,
          completed: false
        },
        {
          name: "Killer Bee",
          required: 10,
          captured: 0,
          completed: false
        },
        {
          name: "Flan Amarillo",
          required: 10,
          captured: 0,
          completed: false
        },
        {
          name: "Ragora",
          required: 10,
          captured: 0,
          completed: false
        }
      ],
      soborno: "2,500 Gil",
      objetoSoborno: "4 Polvos Somníferos",
      areaCompleted: false,
      expanded: false
    }
  ]);

  const updateMonsterCount = (areaId, monsterIndex, increment) => {
    setAreasData(prevData => {
      return prevData.map(area => {
        if (area.id === areaId) {
          const updatedMonsters = area.monsters.map((monster, index) => {
            if (index === monsterIndex) {
              const newCount = Math.max(0, Math.min(monster.required, monster.captured + increment));
              return {
                ...monster,
                captured: newCount,
                completed: newCount >= monster.required
              };
            }
            return monster;
          });
          
          // Check if area is completed
          const areaCompleted = updatedMonsters.every(monster => monster.completed);
          
          return {
            ...area,
            monsters: updatedMonsters,
            areaCompleted
          };
        }
        return area;
      });
    });
  };

  const toggleAreaExpansion = (areaId) => {
    setAreasData(prevData => {
      return prevData.map(area => ({
        ...area,
        expanded: area.id === areaId ? !area.expanded : area.expanded
      }));
    });
  };

  const getAreaProgress = (area) => {
    const totalRequired = area.monsters.reduce((sum, monster) => sum + monster.required, 0);
    const totalCaptured = area.monsters.reduce((sum, monster) => sum + monster.captured, 0);
    return { captured: totalCaptured, total: totalRequired };
  };

  const MonsterRow = ({ monster, areaId, monsterIndex }) => (
    <View style={styles.monsterRow}>
      <View style={styles.monsterInfo}>
        <Text style={styles.monsterName}>{monster.name}</Text>
        <Text style={styles.monsterProgress}>
          {monster.captured}/{monster.required}
        </Text>
      </View>
      
      <View style={styles.monsterControls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.decrementButton]}
          onPress={() => updateMonsterCount(areaId, monsterIndex, -1)}
          disabled={monster.captured <= 0}
        >
          <Ionicons name="remove" size={16} color="white" />
        </TouchableOpacity>
        
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{monster.captured}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.incrementButton]}
          onPress={() => updateMonsterCount(areaId, monsterIndex, 1)}
          disabled={monster.captured >= monster.required}
        >
          <Ionicons name="add" size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      {monster.completed && (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={20} color={colors.successGreen} />
        </View>
      )}
    </View>
  );

  const AreaCard = ({ area }) => {
    const progress = getAreaProgress(area);
    const progressPercentage = (progress.captured / progress.total) * 100;

    return (
      <View style={[styles.areaCard, area.areaCompleted && styles.completedAreaCard]}>
        <TouchableOpacity
          style={styles.areaHeader}
          onPress={() => toggleAreaExpansion(area.id)}
        >
          <View style={styles.areaHeaderLeft}>
            <Text style={[styles.areaTitle, area.areaCompleted && styles.completedText]}>
              {area.zona}
            </Text>
            <Text style={styles.areaObjective}>{area.objetivo}</Text>
            <Text style={styles.areaProgress}>
              {progress.captured}/{progress.total} monstruos capturados
            </Text>
          </View>
          
          <View style={styles.areaHeaderRight}>
            {area.areaCompleted && (
              <Ionicons name="trophy" size={24} color={colors.gold} style={styles.trophyIcon} />
            )}
            <Ionicons 
              name={area.expanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color={colors.lightBlue} 
            />
          </View>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} 
            />
          </View>
          <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
        </View>

        {area.expanded && (
          <View style={styles.areaContent}>
            {/* Monster List */}
            <View style={styles.monstersContainer}>
              {area.monsters.map((monster, index) => (
                <MonsterRow
                  key={index}
                  monster={monster}
                  areaId={area.id}
                  monsterIndex={index}
                />
              ))}
            </View>
            
            {/* Reward Info */}
            <View style={styles.rewardContainer}>
              <Text style={styles.rewardTitle}>Recompensas:</Text>
              <View style={styles.rewardRow}>
                <Ionicons name="gift-outline" size={16} color={colors.gold} />
                <Text style={styles.rewardText}>Soborno: {area.soborno}</Text>
              </View>
              <View style={styles.rewardRow}>
                <Ionicons name="cube-outline" size={16} color={colors.gold} />
                <Text style={styles.rewardText}>Objeto: {area.objetoSoborno}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const totalProgress = areasData.reduce((acc, area) => {
    const progress = getAreaProgress(area);
    return {
      captured: acc.captured + progress.captured,
      total: acc.total + progress.total
    };
  }, { captured: 0, total: 0 });

  const completedAreas = areasData.filter(area => area.areaCompleted).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBlue} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.gold} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Monster Arena</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={colors.gold} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedAreas}</Text>
            <Text style={styles.statLabel}>Áreas Completadas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalProgress.captured}</Text>
            <Text style={styles.statLabel}>Total Capturados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalProgress.total}</Text>
            <Text style={styles.statLabel}>Total Requeridos</Text>
          </View>
        </View>
      </View>

      {/* Areas List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {areasData.map(area => (
          <AreaCard key={area.id} area={area} />
        ))}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const colors = {
  darkBlue: '#1a237e',
  gold: '#ffd700',
  lightBlue: '#64b5f6',
  cardBackground: '#283593',
  accent: '#3949ab',
  white: '#ffffff',
  successGreen: '#4caf50',
  warningOrange: '#ff9800',
  errorRed: '#f44336',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  header: {
    backgroundColor: colors.cardBackground,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
  },
  infoButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
  },
  statLabel: {
    fontSize: 12,
    color: colors.lightBlue,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  areaCard: {
    backgroundColor: colors.cardBackground,
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  completedAreaCard: {
    borderWidth: 2,
    borderColor: colors.successGreen,
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  areaHeaderLeft: {
    flex: 1,
  },
  areaHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 4,
  },
  completedText: {
    color: colors.successGreen,
  },
  areaObjective: {
    fontSize: 14,
    color: colors.lightBlue,
    marginBottom: 4,
  },
  areaProgress: {
    fontSize: 12,
    color: colors.lightBlue,
    fontStyle: 'italic',
  },
  trophyIcon: {
    marginRight: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: colors.darkBlue,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.successGreen,
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    color: colors.lightBlue,
    minWidth: 35,
    textAlign: 'right',
  },
  areaContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  monstersContainer: {
    marginBottom: 16,
  },
  monsterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.accent,
    borderRadius: 8,
    marginBottom: 8,
  },
  monsterInfo: {
    flex: 1,
  },
  monsterName: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
  },
  monsterProgress: {
    fontSize: 12,
    color: colors.lightBlue,
  },
  monsterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrementButton: {
    backgroundColor: colors.errorRed,
  },
  incrementButton: {
    backgroundColor: colors.successGreen,
  },
  countContainer: {
    minWidth: 40,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  countText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  completedBadge: {
    marginLeft: 8,
  },
  rewardContainer: {
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
    padding: 12,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 14,
    color: colors.lightBlue,
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default MonsterArenaScreen;