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

const MonsterArenaScreen = ({ navigation }) => {
  // Sample data 
  const [areasData, setAreasData] = useState([
    {
      id: 1,
      zona: "Besaid",
      objetivoZona: "99 Pócimas de Salud", // Area completion reward from Monster Arena NPC
      monsters: [
        {
          name: "Condor",
          required: 10,
          captured: 0,
          completed: false,
          bribeAmount: "1,900 Gil", // Amount to pay for bribe
          bribeItem: "3 Bombas de Humo" // Item received when bribe succeeds
        },
        {
          name: "Dingo",
          required: 10,
          captured: 0,
          completed: false,
          bribeAmount: "2,500 Gil",
          bribeItem: "4 Polvos Somníferos"
        },
        {
          name: "Flan de Agua",
          required: 10,
          captured: 0,
          completed: false,
          bribeAmount: "6,300 Gil",
          bribeItem: "2 Piedras Agua"
        }
      ],
      areaCompleted: false,
      expanded: true // Start expanded for demo
    },
    {
      id: 2,
      zona: "Kilika",
      objetivoZona: "99 Antídotos", // Area completion reward
      monsters: [
        {
          name: "Dinonix",
          required: 10,
          captured: 0,
          completed: false,
          bribeAmount: "3,200 Gil",
          bribeItem: "2 Garra de Poder"
        },
        {
          name: "Killer Bee",
          required: 10,
          captured: 0,
          completed: false,
          bribeAmount: "2,200 Gil",
          bribeItem: "4 Polvos Somníferos"
        },
        {
          name: "Flan Amarillo",
          required: 10,
          captured: 0,
          completed: false,
          bribeAmount: "7,500 Gil",
          bribeItem: "3 Piedras Rayo"
        },
        {
          name: "Ragora",
          required: 10,
          captured: 0,
          completed: false,
          bribeAmount: "4,800 Gil",
          bribeItem: "2 Escama de Pez"
        }
      ],
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
          Capturados: {monster.captured}/{monster.required}
        </Text>
        <View style={styles.bribeInfo}>
          <Ionicons name="cash-outline" size={12} color={colors.gold} />
          <Text style={styles.bribeText}>
            {monster.bribeAmount} → {monster.bribeItem}
          </Text>
        </View>
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
            <View style={styles.areaRewardContainer}>
              <Ionicons name="trophy-outline" size={16} color={colors.gold} />
              <Text style={styles.areaReward}>Recompensa: {area.objetivoZona}</Text>
            </View>
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
              <Text style={styles.sectionTitle}>Monstruos a Capturar:</Text>
              {area.monsters.map((monster, index) => (
                <MonsterRow
                  key={index}
                  monster={monster}
                  areaId={area.id}
                  monsterIndex={index}
                />
              ))}
            </View>
            
            {/* Area Completion Reward */}
            {area.areaCompleted && (
              <View style={styles.completionRewardContainer}>
                <View style={styles.completionHeader}>
                  <Ionicons name="trophy" size={20} color={colors.gold} />
                  <Text style={styles.completionTitle}>¡Área Completada!</Text>
                </View>
                <Text style={styles.completionText}>
                  Ve al Monster Arena para recibir: {area.objetivoZona}
                </Text>
              </View>
            )}
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
  const totalAreas = areasData.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBlue} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.gold} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Monster Arena</Text>
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={() => Alert.alert(
              'Monster Arena',
              'Captura monstruos para desbloquear recompensas.\n\n💰 Cada monstruo muestra su información de soborno debajo del contador.'
            )}
          >
            <Ionicons name="information-circle-outline" size={24} color={colors.gold} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedAreas}/{totalAreas}</Text>
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
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            💡 Toca las áreas para expandir y ver los monstruos. Usa los botones +/- para contar capturas.
          </Text>
        </View>

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
  instructionsContainer: {
    backgroundColor: colors.accent,
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
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
    marginBottom: 6,
  },
  completedText: {
    color: colors.successGreen,
  },
  areaRewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  areaReward: {
    fontSize: 14,
    color: colors.lightBlue,
    marginLeft: 6,
    fontStyle: 'italic',
  },
  areaProgress: {
    fontSize: 12,
    color: colors.lightBlue,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 12,
  },
  monstersContainer: {
    marginBottom: 16,
  },
  monsterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
    marginBottom: 2,
  },
  bribeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bribeText: {
    fontSize: 11,
    color: colors.gold,
    marginLeft: 4,
    fontStyle: 'italic',
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
  completionRewardContainer: {
    backgroundColor: colors.successGreen,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 8,
  },
  completionText: {
    fontSize: 14,
    color: colors.white,
  },
  bottomPadding: {
    height: 20,
  },
});

export default MonsterArenaScreen;